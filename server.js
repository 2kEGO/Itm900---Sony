const express = require('express');
const connectDb =require('./backend/config/connectDb.js')
const authRoutes = require('./backend/routes/authRoutes.js')
const dotenv = require('dotenv')
const userRoutes = require('./backend/routes/userRoutes.js')
const cors = require('cors')
const AWS = require("aws-sdk");
const multer = require('multer');

// Initialize AWS SDK
const multerUpload = multer();

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
  const { fileName, partNumber, uploadId } = req.body;

  if (!fileName || !partNumber || !uploadId || !req.file) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    PartNumber: parseInt(partNumber),
    UploadId: uploadId,
    Body: req.file.buffer, // No base64 encoding needed
  };

  try {
    const uploadParts = await s3.uploadPart(params).promise();
    res.send({ ETag: uploadParts.ETag });
  } catch (error) {
    console.error("Error uploading part:", error);
    res.status(500).send({ error: error.message });
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

// Connect to database
dotenv.config();
connectDb();
const app = express();

// Middleware 
app.use(cors())
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


//Start server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});