import React, { useState, useEffect } from "react";
import "./CreateProject.css"; // Import CSS file

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [projectUrl, setProjectUrl] = useState("www.example.com");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]); 
  const [selectedUsers, setSelectedUsers] = useState([]);


  const handleUserSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedUsers(selectedOptions);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/sql/auth/User/fullname");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/sql/auth/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_name: projectName,
          project_url: projectUrl,
          user_id: userId,
        }),
      });

      if (response.ok) {
        alert("Project created successfully!");
      } else {
        alert("Error creating project");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Create Project</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Project URL</label>
          <input
            type="text"
            value={projectUrl}
            onChange={(e) => setProjectUrl(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Add Artists</label>
          <select multiple value={selectedUsers} onChange={handleUserSelect} required>
            {users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.full_name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn" type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProject;
