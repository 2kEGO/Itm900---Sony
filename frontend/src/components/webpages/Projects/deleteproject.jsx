import React, { useState, useEffect } from 'react';
import '../AdminPage/list.css';

const Deleteproject = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const getUser = await fetch("http://localhost:5002/sql/auth/projects/all", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (getUser.ok) {
                    const data = await getUser.json();
                    setUsers(data);
                } else {
                    const errorMessage = await getUser.text();
                    alert(`Error fetching projects: ${errorMessage}`);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred while fetching the projects.");
            }
        };

        fetchUser();
    }, []);

    const handleDelete = async (user) => {
        if (!window.confirm("Are you sure you want to delete this project?"))
            return;

        try {
            const response = await fetch(`http://localhost:5002/sql/auth/projects/${user.project_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Project deleted successfully!");
                setUsers(users.filter((u) => u.project_id !== user.project_id)); // Remove deleted project from state
            } else {
                const errorMessage = await response.text();
                alert(`Error deleting project: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while deleting the project.");
        }
    };

    return (
        <div className="list-container">
            <div className="list-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>project_id</th>
                            <th>project_name</th>
                            <th>project_url</th>
                            <th>participating_users</th>
                            <th>user_count</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.project_id}>
                                <td>{user.project_id}</td>
                                <td>{user.project_name}</td>
                                <td>{user.project_url}</td>
                                <td>{user.participating_users}</td>
                                <td>{user.user_count}</td>
                                <td><button onClick={() => handleDelete(user)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Deleteproject;
