import React from 'react'
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import FileUpload from '../UploadFiles/Upload'

const UserPage = () => {

  const getToken = Cookies.get("token");
  const decodedToken = jwtDecode(getToken);
  const getRole = decodedToken.role;
  const navigate = useNavigate();

  const handleReg = () =>{
    navigate("/register")
  }

  return (
    <>
      <div>UserPage</div>
      {getRole === "user" ? null: <button onClick={handleReg}>Register User</button>}
      <FileUpload/>
    </>
    
    
  )
}

export default UserPage