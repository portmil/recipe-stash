import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import recipeService from '../../services/recipes';

const PrivateRoute = ({ children, type }) => {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // check if user data can be found from local storage
    const userJSON = localStorage.getItem('user');
		if (userJSON) {
			const user = JSON.parse(userJSON);
			setUser(true);
			recipeService.setToken(user.token);
		}
    setLoading(false);
  }, []);

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
        return <Navigate to='/main' />;
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

export default PrivateRoute;