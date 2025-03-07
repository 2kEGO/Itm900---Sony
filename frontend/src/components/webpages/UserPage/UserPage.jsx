import React from 'react'
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

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
    </>
    
    
  )
}

export default UserPage