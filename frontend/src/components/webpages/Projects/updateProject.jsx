import React, { useState, useEffect } from 'react';
import './updateProject.css';

const UpdateProject = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5002/sql/auth/projects/all');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5002/sql/auth/User/all');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleProjectSelect = async (projectId) => {
    const project = projects.find(p => p.project_id == projectId);
    setSelectedProject(project);
  };

  const handleAddUser = async () => {
    if (!selectedProject || !selectedUser) {
      setMessage('Please select both a project and a user.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5002/sql/auth/projects/addUser/${selectedProject.project_id}/${selectedUser}`, {
        method: 'POST',
      });
      const result = await response.json();
      setMessage(result.message);
      fetchProjects();
    } catch (error) {
      setMessage('Error adding user to project');
      console.error(error);
    }
  };

  const handleRemoveUser = async () => {
    if (!selectedProject || !selectedUser) {
      setMessage('Please select both a project and a user.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5002/sql/auth/projects/removeUser/${selectedProject.project_id}/${selectedUser}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      setMessage(result.message);
      fetchProjects();
    } catch (error) {
      setMessage('Error removing user from project');
      console.error(error);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) {
      setMessage('Please select a project to delete.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5002/projects/${selectedProject.project_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || 'Error deleting project');
        return;
      }

      const result = await response.json();
      setMessage(result.message);
      fetchProjects();
      setSelectedProject(null); // Clear selected project after deletion
    } catch (error) {
      setMessage('Error deleting project');
      console.error(error);
    }
  };

  return (
    <div className="update-project-container">
      <h1>Manage Projects</h1>
      <label htmlFor="projectSelect">Select Project:</label>
      <select id="projectSelect" className="update-project-select" onChange={(e) => handleProjectSelect(e.target.value)}>
        <option value="">Select a Project</option>
        {projects.map(project => (
          <option key={project.project_id} value={project.project_id}>
            {project.project_name}
          </option>
        ))}
      </select>

      {selectedProject && (
        <table className="project-info-table">
          <tbody>
            <tr><td>Project Name:</td><td>{selectedProject.project_name}</td></tr>
            <tr><td>Project URL:</td><td><a href={selectedProject.project_url} target="_blank" rel="noopener noreferrer">{selectedProject.project_url}</a></td></tr>
            <tr><td>Users:</td><td>{selectedProject.participating_users}</td></tr>
            <tr><td>User Count:</td><td>{selectedProject.user_count}</td></tr>
          </tbody>
        </table>
      )}

      <label htmlFor="userSelect">Select User:</label>
      <select id="userSelect" className="update-project-select" onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">Select a User</option>
        {users.map(user => (
          <option key={user.user_id} value={user.user_id}>
            {user.first_name} {user.last_name}
          </option>
        ))}
      </select>

      <button className="update-project-button" onClick={handleAddUser}>Add User to Project</button>
      <button className="update-project-button" onClick={handleRemoveUser}>Remove User from Project</button>
      <button className="update-project-button delete-button" onClick={handleDeleteProject}>Delete Project</button>

      {message && <p className="update-project-message">{message}</p>}
    </div>
  );
};

export default UpdateProject;
