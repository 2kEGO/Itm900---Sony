const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmailOrUsername, updateUser, deleteUser, getUserById } = require('../models/sqlUserModel');
const pool = require ('./pool') 
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { firstName, lastName, username, email, role, password } = req.body;

  try {
    
    const existingUser = await getUserByEmailOrUsername(email, username);
    if (existingUser) {
      return res.status(400).json({ message: 'User with that email or username already exists' });
    }

    
    const newUser = await createUser(firstName, lastName, username, email, role, password);
    res.status(201).json({ message: 'User created successfully', user: newUser });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Login User
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const query = `SELECT * FROM userInfo WHERE username = $1 LIMIT 1`;
    const { rows } = await pool.query(query, [username]);
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.user_id, username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ 
      message: 'Login successful', 
      token, 
      userId: user.user_id,
      role: user.role
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update User
router.put('/update/:id', async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, username, email, role, password } = req.body;

  
  if (!firstName || !lastName || !username || !email || !role || !password) {
    return res.status(400).json({ message: 'All fields are required: firstName, lastName, username, email, role, password.' });
  }

  try {
    
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

  
    const conflictingUser = await getUserByEmailOrUsername(email, username);
    if (conflictingUser && conflictingUser.user_id !== parseInt(userId)) {
      return res.status(400).json({ message: 'Email or username is already taken by another user.' });
    }

    
    const query = `
      UPDATE userInfo
      SET first_name = $1, last_name = $2, username = $3, email = $4, role = $5, password = $6, updated_at = NOW()
      WHERE user_id = $7
      RETURNING *;
    `;

    const values = [firstName, lastName, username, email, role, password, userId];

    
    const { rows } = await pool.query(query, values);
    const updatedUser = rows[0];

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete User
router.delete('/delete/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await deleteUser(userId); 

    if (result.rowCount === 0) { 
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get User
router.get('/User/all', async (req, res) => {
  try {
    const query = `
      SELECT 
        u.user_id,
        u.first_name,
        u.last_name,
        u.username,
        u.email,
        u.role,
        STRING_AGG(p.project_name, ', ') AS projects
    FROM 
        userinfo u
    LEFT JOIN 
        project_users pu ON u.user_id = pu.user_id
    LEFT JOIN 
        projects p ON pu.project_id = p.project_id
    GROUP BY 
        u.user_id, u.first_name, u.last_name, u.username, u.email, u.role
    ORDER BY 
        u.username;  
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
      SELECT 
    p.project_id,
    p.project_name,
    p.project_url,
    STRING_AGG(u.username, ', ') AS participating_users,
    COUNT(DISTINCT u.user_id) AS user_count
FROM 
    projects p
LEFT JOIN 
    project_users pu ON p.project_id = pu.project_id
LEFT JOIN 
    userinfo u ON pu.user_id = u.user_id
GROUP BY 
    p.project_id,
    p.project_name,
    p.project_url
ORDER BY 
    p.project_name; 
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
router.post('/projects/addUser/:projectId/:user_id', async (req, res) => {
  const { projectId, user_id } = req.params; // Extract projectId and user_id from request params

  try {
    const insertUserToProjectQuery = `
      INSERT INTO project_users (project_id, user_id)
      VALUES ($1, $2) 
      RETURNING project_id, user_id;
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
router.delete('/projects/removeUser/:projectId/:userId', async (req, res) => {
  const { projectId, userId } = req.params;

  try {
    const deleteUserFromProjectQuery = `
      DELETE FROM project_users 
      WHERE project_id = $1 AND user_id = $2
      RETURNING *;
    `;

    const result = await pool.query(deleteUserFromProjectQuery, [projectId, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found in project' });
    }

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

    await client.query('COMMIT'); 

    res.json({ message: 'Project deleted successfully' });

  } catch (error) {

    await client.query('ROLLBACK');
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
    
  } finally {
    client.release();
  }
});

// Update Project
router.put('/projects/update/:projectId', async (req, res) => {
  const { projectId } = req.params;
  const { project_name, project_url } = req.body;

  // Basic validation
  if (!project_name || !project_url) {
    return res.status(400).json({ message: 'Project name and URL are required' });
  }

  try {
    // Check if the project exists
    const projectExistsQuery = `
      SELECT * FROM projects 
      WHERE project_id = $1
    `;
    const projectExists = await pool.query(projectExistsQuery, [projectId]);

    if (projectExists.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update project query (excluding user_id)
    const updateProjectQuery = `
      UPDATE projects
      SET 
        project_name = $1, 
        project_url = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE project_id = $3
      RETURNING *
    `;

    const result = await pool.query(updateProjectQuery, [
      project_name, 
      project_url, 
      projectId
    ]);

    res.json({
      message: 'Project updated successfully',
      project: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
});

module.exports = router;
