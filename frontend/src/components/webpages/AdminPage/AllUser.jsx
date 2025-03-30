import React, { useState, useEffect } from "react";
import '../Projects/project.css'

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5002/sql/auth/User/all");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p className="project-table-loading">Loading...</p>;
  }

  if (error) {
    return <p className="project-table-error">Error: {error}</p>;
  }

  return (
    <div className="project-table-container">
      <h1 className="project-table-title">Users</h1>
      <table className="project-table">
        <thead>
          <tr className="project-table-header">
            <th className="project-table-header-cell">User ID</th>
            <th className="project-table-header-cell">First Name</th>
            <th className="project-table-header-cell">Last Name</th>
            <th className="project-table-header-cell">Username</th>
            <th className="project-table-header-cell">Email</th>
            <th className="project-table-header-cell">Role</th>
            <th className="project-table-header-cell">Projects</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} className="project-table-row">
              <td className="project-table-cell">{user.user_id}</td>
              <td className="project-table-cell">{user.first_name}</td>
              <td className="project-table-cell">{user.last_name}</td>
              <td className="project-table-cell">{user.username}</td>
              <td className="project-table-cell">{user.email}</td>
              <td className="project-table-cell">{user.role}</td>
              <td className="project-table-cell">
                {user.projects ? user.projects : "No Projects"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUser;