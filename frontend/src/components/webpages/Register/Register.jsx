import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { RegisterUser } from '../../../services/authService'
import { useNavigate } from 'react-router-dom'

import './Register.css'

// const Register = () => {

//     const [user,setUser] = useState("")
//     const [pwd, setPwd] = useState("") 
//     const [confirmPwd, setConfirmPwd] = useState("")
//     const [email, setEmail] = useState("")
//     const [role, setRole] = useState("")

    
//     const navigate = useNavigate()

//     const handleSubmit = async(e) => {
//         e.preventDefault();

//         try {
//             if(pwd !== confirmPwd) {
//                 console.log('Password does not match')
//             }

//             const register = await RegisterUser(user, pwd, email, role)

//             if (register){
//                 navigate("/login")
//             }
//             else{
//                 console.log('Error creating account')
//                 return
//             }
            
        
//         } catch (error) {
//             console.error(error)
//         }
//     }

//   return (
//     <>
//         <div className="register-container">

//             <div className="register-wrapper-left">
//                 <img src="" alt="" />
//             </div>

//             <form className="register-wrapper-right" onSubmit={handleSubmit}>

                
//                 <div className="register-item-container" id='title'>
//                     <h1>Create an account</h1>
//                 </div>
                
//                 <div className="register-item-container">
//                     <label htmlFor="username">Username</label>
//                     <input type="text" 
//                             id='username'
//                             required={true}
//                             value={user}
//                             onChange={(e) => setUser(e.target.value)}
//                             autoComplete='false'
//                             // onFocus={setUserFocus(true)}
//                             // onBlur={setUserFocus(false)}
//                             />
//                 </div>
                
//                 <div className="register-item-container">
//                     <label htmlFor="pwd">Password</label>
//                     <input type="password"
//                             id='pwd'
//                             required={true}
//                             value={pwd}
//                             onChange={(e) => setPwd(e.target.value)}
//                             autoComplete='false'
//                             // onFocus={setPwdFocus(true)}
//                             // onBlur={setPwdFocus(false)}
//                             />
//                 </div>

//                 <div className="register-item-container">
//                     <label htmlFor="confirm_pwd">Confirm Password</label>
//                     <input type="password" 
//                             id='confirm_pwd'
//                             required={true}
//                             value={confirmPwd}
//                             onChange={(e) => setConfirmPwd(e.target.value)}
//                             autoComplete='false'
//                             // onFocus={setConfirmPwdFocus(true)}
//                             // onBlur={setConfirmPwdFocus(false)}
//                             />
//                 </div>

//                 <div className="register-item-container">
//                     <label htmlFor="email">Email</label>
//                     <input type="email" 
//                             id='email'
//                             value={email}
//                             required={true}
//                             onChange={(e) => setEmail(e.target.value)}
//                             autoComplete='false'
//                             />
//                 </div>

//                 <div className="register-item-container" id='terms-container'>
//                     <label htmlFor="role">Select Role</label>
//                     <select name="role" id="role" value={role} onChange={(e) => setRole(e.target.value)}>       
//                         <option value="">--Please select--</option>                
//                         <option value="admin">Admin</option>
//                         <option value="manager">Manager</option>
//                         <option value="user">User</option>
//                     </select>
//                 </div>

//                 <div className="register-item-container" id='button-container'>
//                     <button type='submit' id='register-button'>Create account</button>
//                 </div>

//             </form>
//         </div>
//     </>
//   )
// }



const ExternalUserSetupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    role: '',
    projectAccess: [],
    customMessage: ''
  });
  
  const [passwordGenerated, setPasswordGenerated] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  
  const generateRandomPassword = () => {
    // Generate a random password with letters, numbers, and special characters
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setGeneratedPassword(password);
    setPasswordGenerated(true);
    return password;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Generate password if it hasn't been generated yet
    const password = passwordGenerated ? generatedPassword : generateRandomPassword();
    
    // Prepare the data that would be sent to the backend
    const submissionData = {
        ...formData,
        password // Add password to the data
      };
    
    console.log('Submitting external user data:', submissionData);
    
    // In a real app, this would be sent to the backend
    try {
        const registerSuccess = await RegisterUser(submissionData);
        if (registerSuccess) {
            alert("User registered successfully");
            console.log("User registered successfully");
            setFormSubmitted(true);
        } else {
            console.log("User registration failed");
        }
    } catch (error) {
        console.error("Error registering user:", error);
    }
  };
  
  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    alert('Password copied to clipboard!');
  };

  return (
    <div className="register-container">
        <div className="bg-white rounded-lg shadow-md max-w-2xl mx-auto p-6">
        {!formSubmitted ? (
            <>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add External Collaborator</h2>
                <p className="text-gray-600 mt-1">Set up temporary access for external team members</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name*
                    </label>
                    <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name*
                    </label>
                    <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                </div>
                
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username*
                    </label>
                    <input
                        type="text" // Fix: Changed type from "username" to "text"
                        id="username"
                        name="userName" // Fix: Changed name to match state key
                        value={formData.userName}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address*
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                    This email will be used for login and notifications
                </p>
                </div>
                
                <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role*
                </label>
                <input
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                >
                    {/* <option value="Mixing Engineer">Mixing Engineer</option>
                    <option value="Mastering Engineer">Mastering Engineer</option>
                    <option value="Producer">Producer</option>
                    <option value="Session Musician">Session Musician</option>
                    <option value="Graphic Designer">Graphic Designer</option> */}
                </input>
                </div>
                
                
                <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">Security Information</h3>
                
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
                    {passwordGenerated ? (
                    <div className="flex">
                        <input
                        type="text"
                        value={generatedPassword}
                        readOnly
                        className="flex-1 p-2 border bg-gray-100 rounded-l"
                        />
                        <button
                        type="button"
                        onClick={copyPasswordToClipboard}
                        className="px-3 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
                        >
                        Copy
                        </button>
                    </div>
                    ) : (
                    <button
                        type="button"
                        onClick={generateRandomPassword}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Generate Password
                    </button>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                    A secure password will be automatically generated
                    </p>
                </div>
                </div>
                
                
                {formData.sendInvite && (
                <div>
                    <label htmlFor="customMessage" className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Message (Optional)
                    </label>
                    <textarea
                    id="customMessage"
                    name="customMessage"
                    value={formData.customMessage}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a personal message to the invitation email..."
                    ></textarea>
                </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    
                >
                    Create User
                </button>
                </div>
            </form>
            </>
        ) : (
            <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">External user created successfully!</h3>
            <div className="mt-4">
                <p className="text-base text-gray-500">
                {formData.firstName} {formData.lastName} ({formData.role}) has been added as an external collaborator.
                </p>
                <p className="text-base text-gray-500 mt-1">
                {formData.sendInvite 
                    ? 'An invitation email has been sent with login instructions.' 
                    : 'No invitation email was sent. Please share the login credentials manually.'}
                </p>
            </div>
            
            {passwordGenerated && (
                <div className="mt-6 bg-gray-50 p-4 rounded-md inline-block">
                <h4 className="font-medium text-gray-700 mb-2">Login Credentials</h4>
                <p className="text-sm text-gray-600 mb-1">Email: {formData.email}</p>
                <div className="flex">
                    <input
                    type="text"
                    value={generatedPassword}
                    readOnly
                    className="text-sm p-1 border bg-gray-100 rounded-l"
                    />
                    <button
                    type="button"
                    onClick={copyPasswordToClipboard}
                    className="px-2 py-1 bg-blue-600 text-white text-sm rounded-r hover:bg-blue-700"
                    >
                    Copy
                    </button>
                </div>
                </div>
            )}
            
            <div className="mt-6">
                <button
                type="button"
                className="px-4 py-2 border border-blue-300 text-blue-700 rounded hover:bg-blue-50 mr-3"
                >
                Add Another User
                </button>
                <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                Return to Dashboard
                </button>
            </div>
            </div>
        )}
        </div>
    </div>
  );
};

export default ExternalUserSetupForm;



// export default Register