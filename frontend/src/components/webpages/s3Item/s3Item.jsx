import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faTrashCan, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import './s3Item.css'; 

const FileList = () => {
  const [files, setFiles] = useState([]);

  const fetchFileList = async () => {
    try {
      const response = await axios.get('http://localhost:5002/list-s3-items');
      setFiles(response.data.Contents);
    } catch (error) {
      console.error("Error fetching file list:", error);
    }
  };

  const deleteFile = async (fileKey) => {
    try {
      await axios.delete(`http://localhost:5002/delete/${fileKey}`);
      setFiles(files.filter(file => file.Key !== fileKey));
      alert("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete the file.");
    }
  };

  const downloadFile = (fileKey) => {
    const fileUrl = `http://localhost:5002/download/${fileKey}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileKey;
    link.click();
  };

  // Format timestamp in a user-friendly way
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  useEffect(() => {
    fetchFileList();
  }, []);

  return (
    <div className="file-list-container">
      <h1>Files in S3 Bucket</h1>
      <div>
        {files.length > 0 ? (
          files.map((file, index) => (
            <div key={index} className="file-item">
              <div className="file-info">
                <span className="file-name">{file.Key}</span>
                <span className="file-date">
                  <FontAwesomeIcon icon={faCalendarAlt} className="date-icon" />
                  {formatDate(file.LastModified)}
                </span>
              </div>
              <div className="file-actions">
                <button
                  className="download-btn"
                  onClick={() => downloadFile(file.Key)}
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteFile(file.Key)}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-files-message">No files found</div>
        )}
      </div>
    </div>
  );
};

export default FileList;