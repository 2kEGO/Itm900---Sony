import Cookies from "js-cookie";
import { Outlet, Navigate } from "react-router-dom"
import React from 'react'
import { jwtDecode } from "jwt-decode";

const ProtectedRoutes = ({ allowedRoles }) => {
    const token = Cookies.get("token")
    
    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        
        const decodedToken = jwtDecode(token);
        const getRole = decodedToken.role
        
        if (allowedRoles.includes(getRole)){
            return <Outlet/>
        }
        else{
            return <Navigate to="/login" />; 
        }

    } catch (error) {
        console.error(error);
        return <Navigate to="/login" />;
    }
    
    

}

export default ProtectedRoutes;