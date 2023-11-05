import React, { useState, useEffect , useContext } from 'react';
import { Avatar, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import './Body.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { ThemeContext } from '../App';

const Follow = () => {
  const [userData, setUserData] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState({});

  const { darktheme } = useContext(ThemeContext);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const jwtToken = localStorage.getItem('jwtToken');
    try {
      const response = await fetch('https://surge-f-socialmedias-projects.vercel.app/following', {
        method: 'GET',
        headers: {
          Authorization: `${jwtToken}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Function to calculate the difference in days between two dates
  const daysAgo = (date) => {
    const today = new Date();
    const createdDate = new Date(date);
    const timeDifference = today - createdDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference === 0) {
      return `Today`;
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

  const handleLike = async (postId) => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');

      const response = await fetch(`https://surge-f-socialmedias-projects.vercel.app/like/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 200) {
        const responseData = await response.json();
        if(responseData.message==='liked'){
          toast.success("liked",{
            position:'top-right'
          })
        }
        

        const updatedUserData = userData.map((item) => {
          if (item._id === postId) {
            const newLikesCount = responseData.message === 'liked' ? item.likes.length + 1 : item.likes.length - 1;
            return { ...item, isLiked: responseData.message === 'liked', likesCount: newLikesCount };
          }
          return item;
        });
        setUserData(updatedUserData);
        fetchData();

        
      }
    } catch (error) {
      console.error('Error liking the post:', error);
    }
  };

  const toggleShowComments = (postId) => {
    setShowComments((prevShowComments) => ({
      ...prevShowComments,
      [postId]: !prevShowComments[postId],
    }));
  };

  const handleComment = async (postId) => {
    try {
      if (commentText.trim().length < 1) {
        setCommentText('');
        return;
      }
      const jwtToken = localStorage.getItem('jwtToken');

      const response = await fetch(`https://surge-f-socialmedias-projects.vercel.app/comment/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ comment: commentText }),
      });

      if (response.status === 200) {
        toast.success('Commented successfully', {
          position: 'top-right',
        });
        setCommentText('');

        fetchData();
      }
    } catch (error) {
      console.error('Error adding a comment:', error);
    }
  };
  const handledelete = async (userid) =>{
    try{
      const jwtToken = localStorage.getItem('jwtToken');

      const response = await fetch(`https://surge-f-socialmedias-projects.vercel.app/delete/${userid}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: ` ${jwtToken}`,
        }
      });
      if(response.status===200){
        toast.success("Succesfully Deleted", {
          position: 'top-right',
        });
        window.location.reload();
      }
      else{
        toast.error("sorry you don't have access", {
          position: 'top-right',
        });
      }
    }
    catch(err){
      console.log("err")
    }
    
    
  }

  return (
    <div className={`body ${darktheme ? 'dark-theme4' : ''}`}>
      {userData.length > 0 ? (
        userData.map((item) => (
          <div key={item._id} className={`post ${darktheme ? 'dark-theme5' : ''}`}>
            <div className="post__header" onClick={() => toggleShowComments(item._id)}>
              <Avatar
                className="post__avatar"
                alt={item.user.username}
                src={`${item.user.profilePicture}`}
              />
              <Link className="link" to={`/post/${item.user._id}`}>
                <h3>{item.user.username}</h3>
              </Link>
              <p className="post__createdAt">
                {daysAgo(item.createdAt)}
              </p>
              <AccessTimeIcon/>
              <DeleteOutlineIcon sx={{ color: 'red' }} onClick ={()=>handledelete(item._id)}/>
            </div>
            <hr/>
            <p>{item.description}</p>
            <img className="post__image" src={`${item.picture}`} alt="Post" />
            <div className="post__icons">
              <IconButton onClick={() => handleLike(item._id)}>
                {item.isLiked ? <FavoriteSharpIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon />}
                {item.likes.length}
              </IconButton>
              <IconButton onClick={() => toggleShowComments(item._id)}>
                <ChatBubbleOutlineIcon />
                <span style={{ fontSize: '15px' }}>
                  {item.comments.length}
                </span>
              </IconButton>
              <IconButton>
                <ShareIcon />
              </IconButton>
            </div>
            <div className={`comments ${showComments[item._id] ? 'open' : ''}`}>
              {item.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <strong>{comment.user}:</strong> {comment.text}
                </div>
              ))}
            </div>
            <input
              type="text"
              className={`comment-input ${showComments[item._id] ? 'open' : ''}`}
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              className={`comment-button ${showComments[item._id] ? 'open' : ''}`}
              onClick={() => handleComment(item._id)}
            >
              Submit
            </button>
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
  );
};

export default Follow;
