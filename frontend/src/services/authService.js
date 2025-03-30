import Cookies from 'js-cookie';

export const LoginUser = async(user, pwd) => {
    try {
        const res = await fetch(`http://localhost:5002/sql/auth/login`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: user, password: pwd}),
        });

        if(!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (!data){
            console.log('No data from server');
            return;
        }
        
        const token = data.token;
        const id = data.userId;
        const role = data.role;

        //Store values in cookies
        Cookies.set('token', token, { expires: 7 });
        Cookies.set('username', user, { expires: 7 });
        Cookies.set('id', id, { expires: 7 });
        Cookies.set('role', role )
        
        return true;
    
    }
    catch(err){
        console.error('Failed to fetch data from the API', err);
        return false;
    }    
}

export const RegisterUser = async (firstName, lastName, username, email, role, password ) => {
    try {
      const res = await fetch(`http://localhost:5002/sql/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({firstName: firstName, lastName: lastName, username: username, email: email, role: role, password: password}),
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      const data = await res.json();
  
      // If no data is returned, log and return false
      if (!data) {
        console.log('No data from server');
        return false;
      }
  
      console.log(data);
      return true;
  
    } catch (error) {
      console.error('Error during user registration:', error);
      return false; // Return false or handle error with a specific message
    }
}
  

export const UpdateUser = async (userId, updatedData) => {
    try {
        const res = await fetch(`http://localhost:5002/sql/auth/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (!data) {
            console.log('No data from server');
            return false;
        }

        console.log('User updated successfully:', data);
        return true;

    } catch (err) {
        console.error('Failed to update user:', err);
        return false;
    }
};

export const DeleteUser = async (userId) => {
    try {
        const res = await fetch(`http://localhost:5002/sql/auth/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (!data) {
            console.log('No data from server');
            return false;
        }

        console.log('User deleted successfully:', data);
        return true;

    } catch (err) {
        console.error('Failed to delete user:', err);
        return false;
    }
};
