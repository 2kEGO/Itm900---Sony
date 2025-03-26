const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmailOrUsername } = require('../models/sqlUserModel');
const pool = require ('./pool') 
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { firstName, lastName, username, email, role, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await getUserByEmailOrUsername(email, username);
    if (existingUser) {
      return res.status(400).json({ message: 'User with that email or username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await createUser(firstName, lastName, username, email, role, hashedPassword);
    res.status(201).json({ message: 'User created successfully', user: newUser });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await getUserByEmailOrUsername(emailOrUsername, emailOrUsername);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.user_id, username: user.username, email: user.email },
      process.env.SECRET_KEY, // Ensure this is in your .env file
      { expiresIn: '1h' }
    );

    res.json({ 
      message: 'Login successful', 
      token, 
      userId: user.user_id,
      role: user.role
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update User
router.put('/update/:id', async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, username, email, role, password } = req.body;

  try {
    // Check if the user exists
    const existingUser = await getUserByEmailOrUsername(email, username);
    if (existingUser && existingUser.user_id !== parseInt(userId)) {
      return res.status(400).json({ message: 'User with that email or username already exists' });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update the user
    const updatedUser = await updateUser(userId, firstName, lastName, username, email, role, hashedPassword);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Delete User
router.delete('/delete/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    
    const user = await getUserByEmailOrUsername(userId, userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user
    await deleteUser(userId);
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get User
router.get('/User/all', async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM userInfo  
    `;

    const { rows } = await pool.query(query);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

//Get User fullname
router.get('/User/fullname', async (req, res) => {
  try {
    const query = `
      SELECT user_id, first_name || ' ' || last_name AS full_name
      FROM userInfo;

    `;

    const { rows } = await pool.query(query);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

//Get project for admin
router.get('/projects/all', async (req, res) => {

  try {
    const query = `
      SELECT *
      FROM projects  
    `;

    const { rows } = await pool.query(query);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Get project for artists
router.get('/projects/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const query = `
      SELECT p.*
      FROM projects p
      JOIN userInfo up ON p.user_id = up.user_id
      WHERE up.user_id = $1;
    `;

    const { rows } = await pool.query(query, [userId]);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Create New Project
router.post('/projects', async (req, res) => {
  const { project_name, project_url, user_ids } = req.body;

  if (!user_ids || user_ids.length === 0) {
    return res.status(400).json({ message: "At least one artist must be added" });
  }

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    
    const owner_id = user_ids[0];

    
    const insertProjectQuery = `
      INSERT INTO projects (project_name, project_url, user_id, created_at)
      VALUES ($1, $2, $3, NOW()) RETURNING project_id;
    `;
    
    const result = await client.query(insertProjectQuery, [project_name, project_url, owner_id]);
    const projectId = result.rows[0].project_id;

    
    const insertUsersQuery = `
      INSERT INTO project_users (project_id, user_id)
      VALUES ${user_ids.map((_, i) => `($1, $${i + 2})`).join(", ")};
    `;
    
    await client.query(insertUsersQuery, [projectId, ...user_ids]);

    await client.query('COMMIT');
    res.status(201).json({ message: "Project created successfully", projectId });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating project:', error);
    res.status(500).json({ message: "Error creating project" });
  } finally {
    client.release();
  }
});

// Add user to the projects
router.post('/projects/:projectId/users', async (req, res) => {
  const { projectId } = req.params; 
  const { user_id } = req.body;
  
  try {
    
    const checkIfUserExistsQuery = `
      SELECT 1 
      FROM project_users 
      WHERE project_id = $1 AND user_id = $2;
    `;
    const checkResult = await pool.query(checkIfUserExistsQuery, [projectId, user_id]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: 'User already added to the project' });
    }

    
    const insertUserToProjectQuery = `
      INSERT INTO project_users (project_id, user_id)
      VALUES ($1, $2) RETURNING project_id, user_id;
    `;
    const result = await pool.query(insertUserToProjectQuery, [projectId, user_id]);

    
    res.status(201).json({
      message: 'User added to project successfully',
      projectId: result.rows[0].project_id,
      userId: result.rows[0].user_id,
    });
  } catch (error) {
    console.error('Error adding user to project:', error);
    res.status(500).json({ message: 'Error adding user to project' });
  }
});

// Remove user from the projects
router.delete('/projects/:projectId/users/:userId', async (req, res) => {
  const { projectId, userId } = req.params;

  try {
    const deleteUserFromProjectQuery = `
      DELETE FROM project_users 
      WHERE project_id = $1 AND user_id = $2;
    `;
    
    await pool.query(deleteUserFromProjectQuery, [projectId, userId]);

    res.json({ message: 'User removed from the project successfully' });
  } catch (error) {
    console.error('Error removing user from project:', error);
    res.status(500).json({ message: 'Error removing user from project' });
  }
});

// Delete Project
router.delete('/projects/:projectId', async (req, res) => {
  const { projectId } = req.params;

  const client = await pool.connect();
  try {
    await client.query('BEGIN'); 

    
    const deleteProjectUsersQuery = `
      DELETE FROM project_users 
      WHERE project_id = $1;
    `;
    await client.query(deleteProjectUsersQuery, [projectId]);

    
    const deleteTracksQuery = `
      DELETE FROM tracks 
      WHERE project_id = $1;
    `;
    await client.query(deleteTracksQuery, [projectId]);

    
    const deleteProjectQuery = `
      DELETE FROM projects 
      WHERE project_id = $1;
    `;
    await client.query(deleteProjectQuery, [projectId]);

    await client.query('COMMIT'); // Commit the transaction

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback the transaction if there's an error
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  } finally {
    client.release(); // Release the client back to the pool
  }
});




module.exports = router;
