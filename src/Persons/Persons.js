import React, { useEffect, useState,useContext } from 'react';
import { Avatar, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import './Persons.css';
import { useLocation } from 'react-router-dom';
import Home from '../Pages/Home';
import { ThemeContext } from '../App';

const Persons = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const jwtToken = localStorage.getItem('jwtToken');

  const {darktheme} = useContext(ThemeContext)
  let x = location.pathname.split('/')
  let xLen = x.length
  const user = x[xLen-1];
  

// Create a function for the fetch operation
const fetchUserData = () => {
  fetch(`https://surge-f-socialmedias-projects.vercel.app/personpost/${user}`, {
    method: 'GET',
    headers: {
      Authorization: `${jwtToken}`,
    },
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((data) => {
      //console.log(data);
      setUserData(data.userpost);
      setIsFollowing(data.isFollowing);
    })
    .catch((error) => {
      //console.error(error);
      // Handle errors as needed
    });
};

useEffect(() => {
  fetchUserData();
});


  const handleFollowClick = () => {
   fetch(`https://surge-f-socialmedias-projects.vercel.app/follow/${user}`,{
      method:"Post",
      headers:{
        Authorization: `${jwtToken}`,
      }
    })
    .then((res)=>{
      if(res.status===200){
        return res.json()
      }
    })
    .then((data)=>{
      setIsFollowing(data.message)
      fetchUserData()
  })

    
    
    // Store the follow/unfollow state in localStorage
  };
  const daysAgo = (date) => {
    const today = new Date();
    const createdDate = new Date(date);
    const timeDifference = today - createdDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference === 0) {
      return 'Today';
    } else if (daysDifference === 1) {
      return 'Yesterday';
    } 
    else if(daysDifference >30){
      return `${daysDifference % 30} month ago`;
    }
    else {
      return `${daysDifference} days ago`;
    }
  };

  return (
    <>
      <Home />
      <div className="up">
       
        <div className="up__details">
          {userData ? (
            <>
              <h3>{userData[0].user.username}</h3>
              <p>{userData[0].user.email}</p>
              <button
                className={`follow-button ${isFollowing ? 'unfollowed' : ''}`}
                onClick={handleFollowClick}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </>
          ) : null}
        </div>
        <div className="up__post-count">
          <p>Posts:{userData ? userData.length : 0}</p>
        </div>
        <div className="up__profile">
          {userData ? (
            <img
              className="up__avatar"
              alt={userData[0].user.username}
              src={`${userData[0].user.profilePicture}`}
            />
          ) : null}
        </div>
      </div>

      <div className={`body ${darktheme ? 'dark-theme4' : ''}`}>
        {userData ? (
          userData.map((item) => (
            <div key={item._id} className={`post ${darktheme ? 'dark-theme5' : ''}`}>
              <div className="post__header">
                <Avatar
                  className="post__avatar"
                  alt={item.user.username}
                  src={`${item.user.profilePicture}`}
                />
                <h3>{item.user.username}</h3>
                <p className="post__createdAt">
                {daysAgo(item.createdAt)}
                
              </p>
              <AccessTimeIcon/>
              </div>
              <hr/>
              <p>{item.description}</p>
              <img
                className="post__image"
                src={`${item.picture}`}
                alt="Post"
              />
              <div className="post__icons">
                <IconButton>
                  <FavoriteBorderIcon />
                </IconButton>
                <IconButton>
                  <ChatBubbleOutlineIcon />
                </IconButton>
                <IconButton>
                  <ShareIcon />
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <svg class="pl21" viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pl-grad1" x1="1" y1="0.5" x2="0" y2="0.5">
              <stop offset="0%" stop-color="hsl(313,90%,55%)" />
              <stop offset="100%" stop-color="hsl(223,90%,55%)" />
            </linearGradient>
            <linearGradient id="pl-grad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="hsl(313,90%,55%)" />
              <stop offset="100%" stop-color="hsl(223,90%,55%)" />
            </linearGradient>
          </defs>
          <circle class="pl__ring" cx="100" cy="100" r="82" fill="none" stroke="url(#pl-grad1)" stroke-width="36" stroke-dasharray="0 257 1 257" stroke-dashoffset="0.01" stroke-linecap="round" transform="rotate(-90,100,100)" />
          <line class="pl__ball" stroke="url(#pl-grad2)" x1="100" y1="18" x2="100.01" y2="182" stroke-width="36" stroke-dasharray="1 165" stroke-linecap="round" />
        </svg>
        )}
      </div>
    </>
  );
};

export default Persons;