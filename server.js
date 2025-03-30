const express = require('express');
const connectDb = require('./backend/config/connectDb.js');
const authRoutes = require('./backend/routes/authRoutes.js');
const dotenv = require('dotenv');
const userRoutes = require('./backend/routes/userRoutes.js');
const cors = require('cors');
const awsRoutes = require('./backend/routes/awsRoutes.js');
const ck = require('ckey');

//for SQL//
const connectsql = require("./backend/config/connectsql.js") 
const authSqlRoutes = require("./backend/routes/authRouteSql.js")

const multer = require('multer');
const multerUpload = multer({ limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

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
connectsql();

// This Routes handle queries
app.use("/sql/auth", authSqlRoutes)


//AWS access

AWS.config.update({
  accessKeyId: ck.AWS_ACCESS_KEY,
  secretAccessKey: ck.AWS_SECRET_KEY,
  region: ck.AWS_REGION,
});

const s3 = new AWS.S3();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


///AWS upload
app.post("/start-upload", async (req, res) => {
  const { fileName, fileType } = req.body;

  const params = {
    Bucket: ck.S3_BUCKET,
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
  console.log("Request body:", req.body);
  console.log("File received:", req.file);

  const { fileName, partNumber, uploadId } = req.body;
  if (!req.file) {
    return res.status(400).json({ error: "No file chunk received" });
  }

  const params = {
    Bucket: ck.S3_BUCKET,
    Key: fileName,
    PartNumber: parseInt(partNumber, 10),
    UploadId: uploadId,
    Body: req.file.buffer,
  };

  try {
    const uploadParts = await s3.uploadPart(params).promise();
    console.log({ uploadParts });
    res.send({ ETag: uploadParts.ETag });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).send(error);
  }
});

app.post("/complete-upload", async (req, res) => {
  const { fileName, uploadId, parts } = req.body;

  const params = {
    Bucket: ck.S3_BUCKET,
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

app.post("/upload-text-file", async (req, res) => {
  const { uploadId, textFileName, textFileData } = req.body;

  // Here, you can upload the text file to S3 or store it wherever you need.
  // This is an example of saving it directly to a local directory (for simplicity).
  const filePath = `./uploads/${uploadId}_${textFileName}`;

  try {
    fs.writeFileSync(filePath, textFileData); // Save the text file data
    res.status(200).send({ message: "Text file uploaded successfully." });
  } catch (error) {
    console.error("Error uploading text file:", error);
    res.status(500).send({ error: "Failed to upload text file." });
  }
});


//Get Item from S3 bucket
app.get('/list-s3-items', async (req, res) => {
  const bucketParams = {
    Bucket: ck.S3_BUCKET, 
  };

  try {
    const data = await s3.listObjects(bucketParams).promise();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error listing objects:", error);
    res.status(500).send("Error fetching objects from S3");
  }
});

//Download Item from S3 bucket
app.get("/download/:filename", async (req, res) => {
  const filename = req.params.filename;
  try {
      let x = await s3.getObject({ Bucket: ck.S3_BUCKET, Key: filename }).promise();
      res.send(x.Body);
  } catch (error) {
      console.error(error);
      res.status(404).send("File Not Found");
  }
});

//Delete Item from S3 bucket
app.delete("/delete/:filename", async (req, res) => {
  const filename = req.params.filename;
  try {
      await s3.deleteObject({ Bucket: ck.S3_BUCKET, Key: filename }).promise();
      res.send("File Deleted Successfully");
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});




// Start server
const PORT = ck.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
