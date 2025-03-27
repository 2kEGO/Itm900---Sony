import React,{useState, useEffect} from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faFolderClosed} from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';

import "./channel.css"

const SelectProject = () => {

  const [project, setProject] = useState([]);  // Declare state for project
  
  const navigate = useNavigate();

  // Function to fetch project data and set it into state
  const fetchProject = async () => {
    try {
      const response = await fetch(`http://localhost:5002/sql/auth/projects/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched Project:", data);  // Check the response in the console

      // Set the fetched project data into the state
      setProject(data);

    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  useEffect(() => {
    fetchProject(); 
  }, []); 

  return (
    <>
    <div className="projects-container">
        <div className="projects-wrapper">

        <div className="project-title">
          <h1>Projects</h1>
        </div>

        <div className="project-selection-container">
          {project.map((projects, index) => (
            <button key={index} className="project-button" onClick={() => navigate(`/home/artist/channel1`)}>
              <FontAwesomeIcon icon={faFolderClosed} style={{color: "#74C0FC",}} />
              {projects.project_name}
            </button>
          ))}
        </div>

        </div>
      </div>
    </>
  );
};


export default SelectProject;
