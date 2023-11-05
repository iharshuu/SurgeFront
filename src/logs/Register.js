import React, { useState } from 'react';
import './Register.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const register = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user', user.toLowerCase());
    formData.append('email', email);
    formData.append('password', password);
    formData.append('file', file);

    try {
      const response = await fetch('https://surgef.onrender.com/register', {
        method: 'POST',
        body: formData,
      });
      if (response.status === 200) {
        toast.success('Successfully Registered', {
          position: 'top-right',
        });

        navigate('/login');
      } else if (response.status === 400) {
        let data = await response.json()
        toast.error(`${data.message}`, {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(`${error.message}`, {
        position: 'top-right',
      });
    }
  };

  return (
    <div className="register">
      <div className="hehe1">
        <h1 className="ap">SurgeFlow</h1>
      </div>
      <form onSubmit={register} className="register-form">
        <div>
          <label htmlFor="user">Username:</label>
          <input
            id="user"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="file">Profile Picture:</label>
          <input id="file" type="file" onChange={handleFileChange} />
          <span className="verify">(It accepts only .jpg, .jpeg, .png)</span>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <br />
      <p className="p1">
        Have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
