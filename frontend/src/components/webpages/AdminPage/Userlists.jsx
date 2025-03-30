import React, {useState, useEffect} from 'react'
import './list.css'

const Userlists = () => {

    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const getUser = await fetch("http://localhost:5002/sql/auth/User/all", {
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
              alert(`Error fetching project: ${errorMessage}`);
            }
          } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while fetching the project.");
          }
        };

      
        fetchUser();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?"))
            return;

        try {
            const response = await fetch(`http://localhost:5002/sql/auth/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("User deleted successfully!");
                setUsers(users.filter((user) => user.user_id !== id)); // Remove deleted user from state
            } else {
                const errorMessage = await response.text();
                alert(`Error deleting user: ${errorMessage}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while deleting the user.");
        }
    };
      

  return (
    <>
        <div className="list-container">
            <div className="list-wrapper">

                <table>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.user_id}>
                                <td>{user.user_id}</td>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td><button onClick={() => handleDelete(user.user_id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    </>
  )
}

export default Userlists