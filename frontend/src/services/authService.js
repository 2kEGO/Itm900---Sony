import Cookies from 'js-cookie';

export const LoginUser = async(user, pwd) => {
    try {
        const res = await fetch('http://localhost:5000/api/auth/login',{
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
        const role = data.role;

        //Store values in cookies
        Cookies.set('token', token, { expires: 7 });
        Cookies.set('username', user, { expires: 7 });
        Cookies.set('role', role);
        
        return true;
    
    }
    catch(err){
        console.error('Failed to fetch data from the API', err);
        return false;
    }    
}


export const RegisterUser = async(user, pwd, email, role) => {
    try {
        const res = await fetch('http://localhost:5000/api/auth/register',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: user, password: pwd, email, role}),
        });


        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if(!data){
            console.log('No data from server');
            return;
        }

        console.log(data);
        return true;

    } catch (error) {
        console.error(error)
    }
}