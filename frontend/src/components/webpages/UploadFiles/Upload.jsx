import React, { useState } from "react";
import axios from "axios";
import "./Upload.css"

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
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
        "http://localhost:5000/start-upload",
        { fileName, fileType, note } // Send note with file metadata
      );

      uploadId = startUploadResponse.data.uploadId;
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
        formData.append("note", note); // Include the note in every chunk

        const uploadPartResponse = await axios.post(
          "http://localhost:5000/upload-part",
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
        "http://localhost:5000/complete-upload",
        { fileName, uploadId, parts, note } // Send the note with completion
      );

      setFileUrl(completeUploadResponse.data.fileUrl);
      alert("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="upload-container">
      <input type="file" onChange={handleFileChange} />
      <textarea 
        placeholder="Comment Here" 
        value={note} 
        onChange={handleNoteChange} 
      />
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
