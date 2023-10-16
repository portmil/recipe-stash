import '../styles/App.css';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const ProfilePage = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.removeItem('user');
    navigate(0, { replace: true });
  };

  return (
    <div className='App'>
      <h1>Profile</h1>
      <button className='primary-btn' onClick={handleLogout}>LOGOUT</button>
    </div>
  );
};

export default ProfilePage;
