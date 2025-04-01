import React, { useState, useEffect } from 'react';
import './list.css'

const UpdateUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    role: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  // Fetch all users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:5002/sql/auth/User/all`);
      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Function to fetch selected user's details
  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5002/sql/auth/User/${userId}`);
      const userData = await response.json();
      setUserDetails({
        firstName: userData.first_name,
        lastName: userData.last_name,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        password: '', 
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Handle change in form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  // Handle form submission to update user
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, username, email, role, password } = userDetails;

    // Validate input data
    if (!firstName || !lastName || !username || !email || !role || !password) {
      setMessage('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5002/sql/auth/update/${selectedUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('User updated successfully!');
        alert('User updated successfully!');
      } else {
        setMessage(result.message || 'Failed to update user');
      }
    } catch (error) {
      setMessage('Error updating user');
      console.error('Error:', error);
    }
  };

  return (
    <div className="update-user-container">
    <h1>Update User Information</h1>

    {/* Dropdown to select user */}
    <label htmlFor="userSelect" className="form-label">Select User:</label>
    <select
      id="userSelect"
      className="user-select"
      onChange={(e) => {
        const userId = e.target.value;
        setSelectedUser(userId);
        fetchUserDetails(userId);
      }}
    >
      <option value="">Select a User</option>
      {users.map(user => (
        <option key={user.user_id} value={user.user_id}>
          {user.first_name} {user.last_name}
        </option>
      ))}
    </select>

    {/* Form to update user info */}
    {selectedUser && (
      <form onSubmit={handleSubmit} className="user-form">
        <label htmlFor="firstName" className="form-label">First Name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={userDetails.firstName}
          onChange={handleInputChange}
          className="form-input"
          required
        />

        <label htmlFor="lastName" className="form-label">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={userDetails.lastName}
          onChange={handleInputChange}
          className="form-input"
          required
        />

        <label htmlFor="username" className="form-label">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={userDetails.username}
          onChange={handleInputChange}
          className="form-input"
          required
        />

        <label htmlFor="email" className="form-label">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userDetails.email}
          onChange={handleInputChange}
          className="form-input"
          required
        />

        <label htmlFor="role" className="form-label">Role:</label>
        <input
          type="text"
          id="role"
          name="role"
          value={userDetails.role}
          onChange={handleInputChange}
          className="form-input"
          required
        />

        <label htmlFor="password" className="form-label">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={userDetails.password}
          onChange={handleInputChange}
          className="form-input"
          required
        />

        <button type="submit" className="submit-button">Update User</button>
      </form>
    )}

    {/* Displaying the message */}
    {message && <p className="message">{message}</p>}
  </div>
  );
};

export default UpdateUser;
