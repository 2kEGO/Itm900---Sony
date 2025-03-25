import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faFolderClosed} from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { availableProjects } from '../../../context/data'

import "./channel.css"

const SelectProject = () => {

  
  const navigate = useNavigate();

  return (
    <>
      <div className="projects-container">
        <div className="projects-wrapper">

        <div className="project-title">
          <h1>Projects</h1>
        </div>

        <div className="project-selection-container">
          {availableProjects.map((project) => (
            <button key={project.id} className="project-button" onClick={() => navigate(`${project.route}`)}>
              <FontAwesomeIcon icon={faFolderClosed} style={{color: "#74C0FC",}} />
              {project.title}
            </button>
          ))}
        </div>

        </div>
      </div>
    </>
  )
}

export default SelectProject;
