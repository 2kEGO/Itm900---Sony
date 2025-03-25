const express = require('express');
const connectDb = require('./backend/config/connectDb.js');
const authRoutes = require('./backend/routes/authRoutes.js');
const dotenv = require('dotenv');
const userRoutes = require('./backend/routes/userRoutes.js');
const cors = require('cors');
const awsRoutes = require('./backend/routes/awsRoutes.js'); 

const multer = require('multer');
const multerUpload = multer();

const AWS = require('aws-sdk');

// Initialize app first
const app = express();

// Middleware 
app.use(express.json());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Load environment variables
dotenv.config();

// Connect to database
connectDb();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/upload", awsRoutes); 

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post("/start-upload", async (req, res) => {
  const { fileName, fileType } = req.body;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    ContentType: fileType,
  };

  try {
    const upload = await s3.createMultipartUpload(params).promise();
    console.log({ upload });
    res.send({ uploadId: upload.UploadId });
  } catch (error) {
    res.send(error);
  }
});

app.post("/upload-part", multerUpload.single("fileChunk"), async (req, res) => {
  const { fileName, partNumber, uploadId, fileChunk } = req.body;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    PartNumber: partNumber,
    UploadId: uploadId,
    Body: fileChunk,
  };

  try {
    const uploadParts = await s3.uploadPart(params).promise();
    console.log({ uploadParts });
    res.send({ ETag: uploadParts.ETag})
  } catch (error) {
    res.send(error);
  }
});

app.post("/complete-upload", async (req, res) => {
  const { fileName, uploadId, parts } = req.body;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  };

  try {
    const complete = await s3.completeMultipartUpload(params).promise();
    console.log({ complete });
    res.send({ fileUrl: complete.Location });
  } catch (error) {
    res.send(error);
  }
});

app.get('/list-objects', async (req, res) => {
  const bucketParams = {
    Bucket: process.env.S3_BUCKET, 
  };

  try {
    const data = await s3.listObjects(bucketParams).promise();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error listing objects:", error);
    res.status(500).send("Error fetching objects from S3");
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
