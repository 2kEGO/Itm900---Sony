import React, { useState } from "react";
import axios from "axios";

const CHUNK_SIZE = 5 * 1024 * 1024;

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [note, setNote] = useState("");

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
      
      const startUploadResponse = await axios.post("http://localhost:5002/start-upload", {
        fileName,
        fileType,
      });
      
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

        const uploadPartResponse = await axios.post("http://localhost:5002/upload-part", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        parts.push({
          ETag: uploadPartResponse.data.ETag,
          PartNumber: partNumber,
        });

        setUploadProgress(Math.round((partNumber / totalParts) * 100));
      }

      
      const completeUploadResponse = await axios.post("http://localhost:5002/complete-upload", {
        fileName,
        uploadId,
        parts,
      });

      setFileUrl(completeUploadResponse.data.fileUrl);
      alert("File uploaded successfully");
      setNote("");
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
      <input type="text" placeholder="Note" value={note} onChange={(e) => setNote(e.target.event)}/>
      <br />
      {uploadProgress > 0 && <progress value={uploadProgress} max="100">{uploadProgress}%</progress>}
      <br />
      {fileUrl && (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          View Uploaded File
        </a>
      )}
    </div>
  );
};

export default FileUpload;
