import React, { useState, useEffect } from 'react'
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import FileUpload from '../UploadFiles/Upload'

import adminImg from "../../../../public/adminPic.avif"
import artistImg from "../../../../public/artistPic.avif"

import "./channelPage.css"

const ChannelPage = () => {

  const getRole = Cookies.get("role");
  const getUserName = Cookies.get("username");


  const navigate = useNavigate();


  return (
    <>
      <div className="body-container">
        <div className="body-wrapper">

        <div className="role-title">
          <h1>Welcome {getUserName}</h1>
        </div>

        <div className="role-selection-container">
          <button onClick={() => navigate("/home/artist")}>
            <img src={adminImg} alt="" />
            Artist
          </button>
          
          <button 
                 onClick={() => navigate("/home/admin")}       
          >
            <img src={artistImg} alt="" />
            User Administration
          </button>

          
        </div>

        </div>
      </div>
    </>
    
    
  )
}

export default ChannelPage