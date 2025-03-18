const express = require("express");
const { startUpload, uploadPart, completeUpload, multerUpload } = require("../controller/awsController");

const router = express.Router();

router.post("/start-upload", startUpload);
router.post("/upload-part", multerUpload.single("fileChunk"), uploadPart);
router.post("/complete-upload", completeUpload);

module.exports = router;
