import { Navigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { useState, useEffect } from 'react';
import userService from '../../services/user';
import React from 'react';

const PrivateRoute = ({ children, type }) => {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { pathname } = useLocation();

  const getAuthStatus = () => {
    // loading set to true so page doesn't load until token has been retrieved
    setLoading(true);
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setUser(true);
      userService.setToken(user.token);
    }
    // token has been retrieved, can load page
    setLoading(false);
  };

  useEffect(() => {
    getAuthStatus();
  }, [pathname]);

  // only load page after user has been retrieved
  if (!loading) {
    // if page should be visible only to logged users
    if(type === 'users') {
      // load page id user is logged in
      if(user) {
        return (
          <>
            {children}
            <Outlet />
          </>
        );
      } else {
        // if user isn't logged in, redirect to landing page
        return <Navigate to='/' />;
      }
      // if page should be only visible to visitors
    } else {
      if(user) {
        // if user is logged in, redirect to main page
        return <Navigate to='/home' />;
      } else {
        // if user isn't logged in show the page
        return (
          <>
            {children}
            <Outlet />
          </>
        );
      }

    }
  }
};

PrivateRoute.propTypes = {
  children: PropTypes.array,
  type: PropTypes.string,
};

export default PrivateRoute;