import React, { useState , useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css'; // Import the CSS file
import Home from "./Home"
import { ThemeContext } from '../App';
import { toast } from 'react-toastify';

const CreatePost = () => {
  // Step 1: Get the JWT token from local storage
  const jwtToken = localStorage.getItem('jwtToken');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const {darktheme} = useContext(ThemeContext)

  const navigate = useNavigate();
  // Step 2: Extract the user's ID from the JWT token
  const tokenParts = jwtToken.split('.');
  const payload = JSON.parse(atob(tokenParts[1]));
  const userId = payload.data; // Assuming the user ID is stored in the 'data' field

  async function createPost(e) {
    e.preventDefault();
    if(!file){
      toast.error("file is required",{
        position:"top-right"
      })
      return
    }
    // Create a FormData object to send the data to the backend
    const formData = new FormData();
    formData.append('description', desc);
    formData.append('picture', file);
    formData.append('userId', userId); // Include the user's ID in the request

    try {
      // Send a POST request to the backend to create the post
      const response = await fetch('https://surgef.onrender.com/createpost', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 201) {
        // Post created successfully
       // console.log('Post created successfully');
        navigate('/Home');
      } else {
        // Handle error case
        toast.error("file extension couldn't be accesed",{
          position:'top-right'
        })

       // console.error('Error creating post:', response.statusText);
      }
    } catch (error) {
      toast.error("file extension couldn't be accesed",{
        position:'top-right'
      }

      )
      //console.error('Error creating post:', error);
    }
  }

  return (
    <>
    <Home/>
    <div className= {`create-post-container ${darktheme ? 'dark-theme7' : ''}`}>
      <form onSubmit={createPost} className= {`create-post-form ${darktheme ? 'dark-theme8' : ''}`}>
        <label htmlFor="textarea">Caption</label>
        <textarea
          id="textarea"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        ></textarea>

        <label htmlFor="files">Post</label>
        <input
          id="files"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Create</button>
      </form>
    </div>
    </>
  );
};

export default CreatePost;
