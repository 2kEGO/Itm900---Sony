import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { RegisterUser } from '../../../services/authService'
import { useNavigate } from 'react-router-dom'

const Register = () => {

    const [user,setUser] = useState("")
    const [pwd, setPwd] = useState("") 
    const [confirmPwd, setConfirmPwd] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")

    
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            if(pwd !== confirmPwd) {
                console.log('Password does not match')
            }

            const register = await RegisterUser(user, pwd, email, role)

            if (register){
                navigate("/login")
            }
            else{
                console.log('Error creating account')
                return
            }
            
        
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <>
        <div className="register-container">

            <div className="register-wrapper-left">
                <img src="" alt="" />
            </div>

            <form className="register-wrapper-right" onSubmit={handleSubmit}>

                
                <div className="register-item-container" id='title'>
                    <h1>Create an account</h1>
                </div>
                
                <div className="register-item-container">
                    <label htmlFor="username">Username</label>
                    <input type="text" 
                            id='username'
                            required={true}
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            autoComplete='false'
                            // onFocus={setUserFocus(true)}
                            // onBlur={setUserFocus(false)}
                            />
                </div>
                
                <div className="register-item-container">
                    <label htmlFor="pwd">Password</label>
                    <input type="password"
                            id='pwd'
                            required={true}
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            autoComplete='false'
                            // onFocus={setPwdFocus(true)}
                            // onBlur={setPwdFocus(false)}
                            />
                </div>

                <div className="register-item-container">
                    <label htmlFor="confirm_pwd">Confirm Password</label>
                    <input type="password" 
                            id='confirm_pwd'
                            required={true}
                            value={confirmPwd}
                            onChange={(e) => setConfirmPwd(e.target.value)}
                            autoComplete='false'
                            // onFocus={setConfirmPwdFocus(true)}
                            // onBlur={setConfirmPwdFocus(false)}
                            />
                </div>

                <div className="register-item-container">
                    <label htmlFor="email">Email</label>
                    <input type="email" 
                            id='email'
                            value={email}
                            required={true}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete='false'
                            />
                </div>

                <div className="register-item-container" id='terms-container'>
                    <label htmlFor="role">Select Role</label>
                    <select name="role" id="role" value={role} onChange={(e) => setRole(e.target.value)}>       
                        <option value="">--Please select--</option>                
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="user">User</option>
                    </select>
                </div>

                <div className="register-item-container" id='button-container'>
                    <button type='submit' id='register-button'>Create account</button>
                </div>

            </form>
        </div>
    </>
  )
}

export default Register