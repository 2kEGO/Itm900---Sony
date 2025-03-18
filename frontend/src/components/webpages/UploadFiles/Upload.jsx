import React, { useState } from "react";
import axios from "axios";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const fileName = file.name;
    const fileType = file.type;
    let uploadId = "";
    let parts = [];

    try {
      // Start the multipart upload
      const startUploadResponse = await axios.post(
        "http://localhost:3001/start-upload",
        {
          fileName,
          fileType,
        }
      );

      uploadId = startUploadResponse.data.uploadId;

      // Split the file into chunks and upload each part
      const totalParts = Math.ceil(file.size / CHUNK_SIZE);

      for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        const start = (partNumber - 1) * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const fileChunk = file.slice(start, end);

        const formData = new FormData();
        formData.append("fileChunk", fileChunk);
        formData.append("fileName", fileName);
        formData.append("partNumber", partNumber);
        formData.append("uploadId", uploadId);

        const uploadPartResponse = await axios.post(
          "http://localhost:3001/upload-part",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        parts.push({
          ETag: uploadPartResponse.data.ETag,
          PartNumber: partNumber,
        });
      }

      // Complete the multipart upload
      const completeUploadResponse = await axios.post(
        "http://localhost:3001/complete-upload",
        {
          fileName,
          uploadId,
          parts,
        }
      );

      setFileUrl(completeUploadResponse.data.fileUrl);
      alert("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button disabled={!file} onClick={handleFileUpload}>
        Upload
      </button>
      {fileUrl && (
        <div>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            View Uploaded File
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
