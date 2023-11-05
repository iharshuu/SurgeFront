import React, { useEffect, useState, useContext } from 'react';
import './Home.css';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { ThemeContext } from '../App';

const Home = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  const { darktheme, toggleDarktheme } = useContext(ThemeContext);

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
      navigate('/');
    } else {
      fetch('https://surge-f-socialmedias-projects.vercel.app/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            navigate('/');
            toast.error('An error occurred', {
              position: 'top-right',
            });
            throw new Error('User not found');
          }
        })
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          navigate('/');
          console.error('Error fetching user data:', error);
        });
    }
  }, [navigate]);

  const handleLogoutClick = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('isFollowing');
    navigate('/');
  };

  const handleUsernameClick = () => {
    setShowLogout(!showLogout);
  };

  return (
    <div>
      <div className={`header-container ${darktheme ? 'dark-theme' : ''}`}>
      <Brightness4Icon onClick={toggleDarktheme} style={{ cursor: "pointer", marginLeft: "20px" }} />

        <div className="left">
          <Link className='ll' to="/home">
            <h1 className="app-name">SurgeFlow</h1>
          </Link>
        </div>
        {userData ? (
          <div className="header">
            <Link to="/newpost">
              <AddAPhotoOutlinedIcon className="add-icon" />
            </Link>
            <div className="user-info">
              <div className="user-profile" onClick={handleUsernameClick}>
                <img
                  src={`${userData.profilePicture}`}  //Uploads  Uploads
                  alt="user dp"
                  className="user-dp"
                />
                <div className="username">{userData.username}</div>
                {showLogout && (
                  <div className="logout" onClick={handleLogoutClick}>
                    <ExitToAppIcon />
                    Logout
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="loading-text">Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
