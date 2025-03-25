const express = require("express");
const { startUpload, uploadPart, completeUpload, multerUpload, listS3Items } = require("../controller/awsController");

const router = express.Router();

router.post("/start-upload", startUpload);
router.post("/upload-part", multerUpload.single("fileChunk"), uploadPart);
router.post("/complete-upload", completeUpload);

router.get("/s3-items", listS3Items);

module.exports = router;

