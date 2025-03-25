import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileList = () => {
  const [files, setFiles] = useState([]);

  const fetchFileList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/list-objects');
      setFiles(response.data.Contents); // The list of files will be in the 'Contents' array
    } catch (error) {
      console.error("Error fetching file list:", error);
    }
  };

  const downloadFile = (fileKey) => {

    // This assumes the file is publicly accessible in your S3 bucket
    const fileUrl = `https://${import.meta.env.VITE_S3_BUCKET}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${fileKey}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileKey; // This will suggest the file name to be saved as
    link.click();
  };  

  useEffect(() => {
    fetchFileList();
  }, []);

  return (
    <div>
      <h1>Files in S3 Bucket</h1>
      <ul>
        {files.length > 0 ? (
          files.map((file, index) => (
            <li key={index}>
              <button onClick={() => downloadFile(file.Key)}>
                {file.Key} - {file.Size} bytes
              </button>
            </li>
          ))
        ) : (
          <li>No files found</li>
        )}
      </ul>
    </div>
  );
};

export default FileList;
