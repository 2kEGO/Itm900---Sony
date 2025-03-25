import Cookies from "js-cookie";
import { Outlet, Navigate } from "react-router-dom"
import React from 'react'

const ProtectedRoutes = () => {
    const token = Cookies.get("token")

    return token ? <Outlet/> : <Navigate to="/"/>   

}

export default ProtectedRoutes;