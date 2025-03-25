import React, {useState, useEffect, useContext} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LoginUser } from '../../../services/authService'

import "./Login.css"

const Login = () => {
  
    const [user, setUser] = useState("")
    const [pwd, setPwd] = useState("")
    
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const login = await LoginUser(user, pwd)

            if(!login){
                console.log("Username or password incorrect")
            }

            navigate('/home')

        } catch (error) {
            console.error(error)
        }

    }

    return (
    <>
        <div className="login-container">

            <div className="login-wrapper">


                <form className='form-container'>

                    <div className="login-item-container" id='login-title'>
                        <h1>Sign in</h1>
                    </div>

                    <div className="login-item-container">
                        <label htmlFor="username">Username:</label>
                        <input type="text"
                                id='username' 
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                placeholder='Username'
                                />
                    </div>

                    <div className="login-item-container">
                        <label htmlFor="pwd">Password:</label>
                        <input type="password" 
                                id='pwd'
                                value={pwd}
                                onChange={(e) => setPwd(e.target.value)}
                                placeholder='Password'
                            />
                    </div>

                    <div className="login-item-container" id='login-button-container'>
                        <button onClick={handleSubmit} id='login-button'>Sign in</button>
                    </div>

                </form>

            </div>
        </div>    
    </>
  )
}

export default Login