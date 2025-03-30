const s3 = require('../config/awsConfig')
const multer = require('multer');
const ck = require('ckey');

const multerUpload = multer();

const startUpload = async (req, res) => {
  const { fileName, fileType, note } = req.body; // Added note extraction

  // Generate a unique key that includes the note as metadata
  const key = `${Date.now()}-${fileName}`;
  
  const params = {
    Bucket: ck.S3_BUCKET,
    Key: key,
    ContentType: fileType,
    // Store the note as metadata
    Metadata: {                           // Added metadata object to store note
      note: note || ''                    // Store note safely, default to empty string
    }
  };

  try {
    const upload = await s3.createMultipartUpload(params).promise();
    res.send({ 
      uploadId: upload.UploadId,
      key: key                           // Return the key for future reference
    });
  } catch (error) {
    console.error("Error starting upload:", error);
    res.status(500).send({ error: error.message });
  }
};

const uploadPart = async (req, res) => {
  const { fileName, partNumber, uploadId } = req.body;

  if (!fileName || !partNumber || !uploadId || !req.file) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  const params = {
    Bucket: ck.S3_BUCKET,
    Key: fileName,
    PartNumber: parseInt(partNumber),
    UploadId: uploadId,
    Body: req.file.buffer,
  };

  try {
    const uploadParts = await s3.uploadPart(params).promise();
    res.send({ 
      ETag: uploadParts.ETag,
      partNumber: parseInt(partNumber)   // Added partNumber for better tracking
    });
  } catch (error) {
    console.error("Error uploading part:", error);
    res.status(500).send({ error: error.message });
  }
};

const completeUpload = async (req, res) => {
  const { fileName, uploadId, parts } = req.body;

  const params = {
    Bucket: ck.S3_BUCKET,
    Key: fileName,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  };

  try {
    const complete = await s3.completeMultipartUpload(params).promise();
    
    // Get the object's metadata to include in the response
    const headParams = {
      Bucket: ck.S3_BUCKET,
      Key: fileName
    };
    
    const headData = await s3.headObject(headParams).promise();
    
    res.send({ 
      fileUrl: complete.Location,
      note: headData.Metadata?.note || '' // Return the stored note
    });
  } catch (error) {
    console.error("Error completing upload:", error);
    res.status(500).send({ error: error.message });
  }
};


const abortUpload = async (req, res) => {  // Added new function for aborting uploads
  const { fileName, uploadId } = req.body;
  
  if (!fileName || !uploadId) {
    return res.status(400).send({ error: "Missing required fields" });
  }
  
  const params = {
    Bucket: ck.S3_BUCKET,
    Key: fileName,
    UploadId: uploadId
  };
  
  try {
    await s3.abortMultipartUpload(params).promise();
    res.send({ message: "Upload aborted successfully" });
  } catch (error) {
    console.error("Error aborting upload:", error);
    res.status(500).send({ error: error.message });
  }
};

const listS3Items = async (req, res) => {
const params = { Bucket: ck.S3_BUCKET };

try {
  const data = await s3.listObjectsV2(params).promise();
  
  // Use Promise.all to fetch metadata for all objects
  const itemPromises = data.Contents.map(async (item) => {
    // Get metadata for each object
    const headParams = {
      Bucket: ck.S3_BUCKET,
      Key: item.Key
    };
    
    try {
      const headData = await s3.headObject(headParams).promise();
      
      return {
        key: item.Key,
        lastModified: item.LastModified,
        size: item.Size,
        // Use signed URL with expiration instead of direct URL construction
        url: s3.getSignedUrl('getObject', {  // Security improvement: use signed URLs
          Bucket: ck.S3_BUCKET,
          Key: item.Key,
          Expires: 3600 // URL expires in 1 hour
        }),
        note: headData.Metadata?.note || ''  // Include the note from metadata
      };
    } catch (error) {
      console.error(`Error getting head for ${item.Key}:`, error);
      return {
        key: item.Key,
        lastModified: item.LastModified,
        size: item.Size,
        error: "Failed to fetch metadata"
      };
    }
  });
  
  const items = await Promise.all(itemPromises);
  res.json(items);
} catch (error) {
  console.error("Error fetching S3 items:", error);
  res.status(500).json({ error: "Failed to fetch items from S3" });
}
};

module.exports = { startUpload, uploadPart, completeUpload, abortUpload, listS3Items};