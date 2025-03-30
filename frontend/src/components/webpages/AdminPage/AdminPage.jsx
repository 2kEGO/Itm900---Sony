import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faUserPlus, faUsers, faDiagramProject, faListCheck} from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import "../UserPage/channelPage.css"


const AdminPage = () => {

  const navigate = useNavigate();

  return (
    <>
      <div className="body-container">
        <div className="body-wrapper">

        <div className="role-title">
          <h1>User Administration</h1>
        </div>

        <div className="role-selection-container">
          <button onClick={() => navigate("/home/admin/allUser")}>
          <FontAwesomeIcon icon={faUserPlus} />
            User List
          </button>

          <button onClick={() => navigate("/register")}>
          <FontAwesomeIcon icon={faUserPlus} />
            SET UP NEW USER
          </button>
          
          <button onClick={() => navigate("/home/admin/updateUser")}>
            <FontAwesomeIcon icon={faUsers} />
            Update User
          </button>

          <button onClick={() => navigate("/home/admin/userlists")}>
            <FontAwesomeIcon icon={faUsers} />
            Delete User
          </button>

          <button onClick={() => navigate("/home/admin/projectlist")}>
          <FontAwesomeIcon icon={faListCheck} />
            Project List
          </button>
          
          <button onClick={() => navigate("/home/admin/updateProject")}>
          <FontAwesomeIcon icon={faListCheck} />
            Update Project
          </button>
          
          <button onClick={() => navigate("/home/admin/createproject")}>
          <FontAwesomeIcon icon={faDiagramProject} />
            Create New Project
          </button>
          
          <button onClick={() => navigate("/home/admin/deleteproject")}>
          <FontAwesomeIcon icon={faDiagramProject} />
            Delete Project
          </button>

          
        </div>

        </div>
      </div>
    </>
  )
}

export default AdminPage;