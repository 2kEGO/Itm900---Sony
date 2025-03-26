import React,{useState, useEffect} from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faFolderClosed, faPlus} from "@fortawesome/free-solid-svg-icons"

import Cookies from 'js-cookie';

const Project = () => {
    const [project, setProject] = useState([]);

      const fetchProject = async () => {
        try {
          const response = await fetch(`http://localhost:5000/sql/auth/projects/all`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const data = await response.json();
          console.log("Fetched Project:", data); 
    
          
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
                <button key={index} className="project-button">
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


export default Project