import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faUserPlus, faUsers} from "@fortawesome/free-solid-svg-icons"
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
          <button onClick={() => navigate("/register")}>
          <FontAwesomeIcon icon={faUserPlus} />
            SET UP NEW USER
          </button>
          
          <button onClick={() => navigate("/home/admin/userlist")}>
            <FontAwesomeIcon icon={faUsers} />
            User List
          </button>

          
        </div>

        </div>
      </div>
    </>
  )
}

export default AdminPage;