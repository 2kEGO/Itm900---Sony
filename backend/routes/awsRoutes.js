const express = require("express");
const {startUpload, uploadPart, completeUpload, abortUpload, listS3Items } = require("../controller/awsController");
const multer = require('multer');

const router = express.Router();
const multerUpload = multer();

// File upload routes
router.post("/start-upload", startUpload);
router.post("/upload-part", multerUpload.single("fileChunk"), uploadPart);
router.post("/complete-upload", completeUpload);
router.post("/abort-upload", abortUpload); 

// File listing route
router.get("/list-s3-items", listS3Items); 

module.exports = router;