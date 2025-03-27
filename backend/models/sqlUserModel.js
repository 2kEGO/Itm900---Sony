const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const ck = require('ckey');

// Initialize PostgreSQL client

const pool = new Pool({
    user: ck.DB_USER,
    host: ck.DB_HOST,
    database: ck.DB_NAME,
    password: ck.DB_PASSWORD,
    port: ck.DB_PORT,
});

// Validate input fields
const validateUserInput = (firstName, lastName, username, email, role, password) => {
  if (!firstName || !lastName || !username || !email || !role || !password) {
    throw new Error('All fields are required');
  }
  if (typeof password !== 'string' || password.trim() === '') {
    throw new Error('Password must be a valid string');
  }
  // Add more validations as needed (e.g., email format, etc.)
};

// Create a new user
const createUser = async (firstName, lastName, username, email, role, password) => {
  validateUserInput(firstName, lastName, username, email, role, password);
  
  const query = `INSERT INTO userInfo(first_name, last_name, username, email, role, password, created_at, updated_at)
                 VALUES($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`;

  const values = [firstName, lastName, username, email, role, password];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('Error creating user');
  }
};

// Get user by username or email (for login)
const getUserByEmailOrUsername = async (email, username) => {
  const query = `SELECT * FROM userInfo WHERE email = $1 OR username = $2 LIMIT 1`;
  const values = [email, username];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching user');
  }
};

// Update user information
const updateUser = async (userId, firstName, lastName, username, email, role, password) => {
    const query = `
      UPDATE userInfo
      SET first_name = $1, last_name = $2, username = $3, email = $4, role = $5, password = $6, updated_at = NOW()
      WHERE user_id = $7
      RETURNING *;
    `;
    const values = [firstName, lastName, username, email, role, password, userId];
  
    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error(error);
      throw new Error('Error updating user');
    }
  };
  
  // Delete a user by ID
const deleteUser = async (userId) => {
  const query = 'DELETE FROM userInfo WHERE user_id = $1 RETURNING *;';
  const values = [userId];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('Error deleting user');
  }
};

// Function to get a user by their user_id
const getUserById = async (userId) => {
  const query = 'SELECT * FROM userInfo WHERE user_id = $1';
  const values = [userId];
  
  try {
    const { rows } = await pool.query(query, values);
    return rows[0]; // Return the first matching row (should be one user)
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Error fetching user by ID');
  }
};


module.exports = { createUser, getUserByEmailOrUsername, updateUser, deleteUser, getUserById };
