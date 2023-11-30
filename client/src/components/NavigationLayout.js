import '../styles/App.css';
import '../styles/NavigationLayout.css';
import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { ReactComponent as HomeIcon } from '../graphics/home_icon.svg';
import { ReactComponent as SearchIcon } from '../graphics/search_icon.svg';
import { ReactComponent as RankIcon } from '../graphics/rank_icon.svg';
import { ReactComponent as ProfileIcon } from '../graphics/profile_icon.svg';
import { ReactComponent as NavBackground } from '../graphics/nav_background.svg';
import { ReactComponent as AddButton } from '../graphics/add_button.svg';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationLayout = () => {

  const { pathname } = useLocation();

  /* Automatically scrolls to top whenever pathname changes */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div id='container'> 
      <nav id='navigation'>
        <div id='nav-bar-mobile'>
          <div className='nav-background-fill' id='nav-background-fill-left'/>
          <div className='nav-background-fill' id='nav-background-fill-right'/>
          <NavBackground id='nav-background'/>
          <NavLink to='/add-recipe'><AddButton className='nav-icon' id='add-button'/></NavLink>
          <div id='nav-bar-mobile-icons'>
            <NavLink id='home-icon' to='/home'><HomeIcon className='nav-icon'/></NavLink>
            <NavLink id='search-icon' to='/search'><SearchIcon className='nav-icon'/></NavLink>
            <NavLink id='rank-icon' to='/ranking'><RankIcon className='nav-icon'/></NavLink>
            <NavLink id='profile-icon' to='/profile'><ProfileIcon className='nav-icon'/></NavLink>
          </div>
        </div>
        <div id='nav-bar-desktop'>
          <h2>Recipe Stash</h2>
          <div id='nav-bar-desktop-links'>
            <NavLink  id='home-icon' to='/home'>
              <HomeIcon className='nav-icon'/>
              <p>Home</p>
            </NavLink>
            <NavLink to='/add-recipe'>
              <AddButton className='nav-icon' id='add-button'/>
              <p>Add recipe</p>
            </NavLink>
            <NavLink id='rank-icon' to='/ranking'>
              <RankIcon className='nav-icon'/>
              <p>Rank recipes</p>
            </NavLink>
            <NavLink id='search-icon' to='/search'>
              <SearchIcon className='nav-icon'/>
              <p>Search</p>
            </NavLink>
            <NavLink id='profile-icon' to='/profile'>
              <ProfileIcon className='nav-icon'/>
              <p>Profile</p>
            </NavLink>
          </div>  
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default NavigationLayout;
