const s3 = require('../config/awsConfig')
const multer = require('multer');

const multerUpload = multer();

const startUpload = async (req, res) => {
    const { fileName, fileType } = req.body;
  
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      ContentType: fileType,
    };
  
    try {
      const upload = await s3.createMultipartUpload(params).promise();
      res.send({ uploadId: upload.UploadId });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
};
  
const uploadPart = async (req, res) => {
    const { fileName, partNumber, uploadId } = req.body;
  
    if (!fileName || !partNumber || !uploadId || !req.file) {
      return res.status(400).send({ error: "Missing required fields" });
    }
  
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      PartNumber: parseInt(partNumber),
      UploadId: uploadId,
      Body: req.file.buffer,
    };
  
    try {
      const uploadParts = await s3.uploadPart(params).promise();
      res.send({ ETag: uploadParts.ETag });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
};
  
const completeUpload = async (req, res) => {
    const { fileName, uploadId, parts } = req.body;
  
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    };
  
    try {
      const complete = await s3.completeMultipartUpload(params).promise();
      res.send({ fileUrl: complete.Location });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
};

const listS3Items = async (req, res) => {
  const params = { Bucket: process.env.S3_BUCKET };

  try {
    const data = await s3.listObjectsV2(params).promise();
    const items = data.Contents.map((item) => ({
      key: item.Key,
      lastModified: item.LastModified,
      size: item.Size,
      url: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
    }));

    res.json(items);
  } catch (error) {
    console.error("Error fetching S3 items:", error);
    res.status(500).json({ error: "Failed to fetch items from S3" });
  }
};
  
module.exports = { startUpload, uploadPart, completeUpload, multerUpload, listS3Items };