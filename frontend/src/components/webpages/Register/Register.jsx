import React, { useState } from 'react';
import { RegisterUser } from '../../../services/authService';
import './Register.css';

const ExternalUserSetupForm = () => {
  // Separate useState for each field
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState(''); // Added password state

  const [formSubmitted, setFormSubmitted] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const registerSuccess = await RegisterUser(firstName, lastName, username, email, role, password);

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

  return (
    <div className="external-user-setup-form">
      <div className="external-user-setup-form-container">
        <div className="external-user-setup-form-header">
          <h2 className="external-user-setup-form-title">Add External Collaborator</h2>
          <p className="external-user-setup-form-description">Set up temporary access for external team members</p>
        </div>

        <form className="external-user-setup-form-body">
          <div className="external-user-setup-form-grid">
            <div>
              <label htmlFor="firstName" className="external-user-setup-form-label">
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="external-user-setup-form-input"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="external-user-setup-form-label">
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="external-user-setup-form-input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="external-user-setup-form-label">
              Username*
            </label>
            <input
              type="text"
              id="username"
              name="userName"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="external-user-setup-form-input"
            />
          </div>

          <div>
            <label htmlFor="email" className="external-user-setup-form-label">
              Email Address*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="external-user-setup-form-input"
            />
          </div>

          <div>
            <label htmlFor="role" className="external-user-setup-form-label">
              Role*
            </label>
            <input
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="external-user-setup-form-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="external-user-setup-form-label">
              Password*
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="external-user-setup-form-input"
            />
          </div>

          <div className="external-user-setup-form-footer">
            <button
              type="submit"
              className="external-user-setup-form-button"
              onClick={handleSubmit}
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExternalUserSetupForm;
