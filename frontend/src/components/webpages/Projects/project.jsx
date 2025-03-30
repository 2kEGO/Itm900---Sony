import React, { useState, useEffect } from "react";
import './project.css'

const ProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5002/sql/auth/projects/all");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <p className="project-table-loading">Loading...</p>;
  }

  if (error) {
    return <p className="project-table-error">Error: {error}</p>;
  }

  return (
    <div className="project-table-container">
      <h1 className="project-table-title">Projects</h1>
      <table className="project-table">
        <thead>
          <tr className="project-table-header">
            <th className="project-table-header-cell">Project ID</th>
            <th className="project-table-header-cell">Project Name</th>
            <th className="project-table-header-cell">Project URL</th>
            <th className="project-table-header-cell">Participating Users</th>
            <th className="project-table-header-cell">User Count</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.project_id} className="project-table-row">
              <td className="project-table-cell">{project.project_id}</td>
              <td className="project-table-cell">{project.project_name}</td>
              <td className="project-table-cell">
                <a
                  className="project-table-link"
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.project_url}
                </a>
              </td>
              <td className="project-table-cell">
                {project.participating_users || "N/A"}
              </td>
              <td className="project-table-cell">{project.user_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
