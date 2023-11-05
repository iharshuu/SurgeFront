import './App.css';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './logs/Login';
import Register from './logs/Register';
import CreatePost from './Pages/CreatePost';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Persons from './Persons/Persons';
import Main from './Main/Main';

const ThemeContext = React.createContext();

function App() {
  const [darktheme, setDarktheme] = useState(false);

  // Function to toggle darktheme
  const toggleDarktheme = () => {
    setDarktheme((prevDarktheme) => !prevDarktheme);
    
  };

  return (
    <ThemeContext.Provider value={{ darktheme, toggleDarktheme }}>
      <div className={`app ${darktheme ? 'dark-theme1' : ''}`}>
        <div className={`container ${darktheme ? 'dark-theme2' : ''}`}>
          <Router>
            <Routes>
              <Route path="/" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/Home" element={<Main />} />
              <Route path="/newpost" element={<CreatePost />} />
              <Route path="/post/:id" element={<Persons />} />
              {/* Add more routes as needed */}
            </Routes>
          </Router>
          <ToastContainer />
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export { App, ThemeContext };
