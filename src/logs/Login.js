import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://surge-f-socialmedias-projects.vercel.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, password }),
      });

      if (response.status === 200) {
        const data = await response.json();

        // Store the JWT token in a cookie
        localStorage.setItem('jwtToken', data.token);
        toast.success('This is a success Logged in!', {
          position: 'top-right', // Position of the notification
        });

        // Redirect to the desired page upon successful login (adjust the path accordingly)
        navigate('/Home');
      } else {
        // Handle login failure, e.g., show an error message to the user
        const data = await response.json()
        toast.error(`An error occurred: ${data.message}`, {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`, {
        position: 'top-right',
      });
    }
  };

  return (
    <>
    
    <div className="login-container">
    <div className="hehe">
          <h1 className="app1">SurgeFlow</h1>
      </div>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="user">Username:</label>
          <input
            id="user"
            type="text"
            value={user}
            onChange={(e) => setUser((e.target.value).toLowerCase())}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="login-button" type="submit">
          Log in
        </button>
      </form>
      <p className="register-link">
        Don't have an account?{' '}
        <Link to="/">
          <p>Register</p>
        </Link>
      </p>
    </div>
    </>
  );
};

export default Login;
