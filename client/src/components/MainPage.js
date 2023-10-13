import '../styles/App.css';
import '../styles/HomePage.css';
import homeGraphic from '../graphics/home_page_graphic.svg';
import sortIcon from '../graphics/sort_icon.svg';
import allIcon from '../graphics/all_icon.svg';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const MainPage = () => {

    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect (() => {
    // get categories from backend

    // get all recipes from backend
    }, []);

    // MOVE TO USER PAGE
    /*const handleLogout = () => {
		window.localStorage.removeItem('user');
		navigate(0, { replace: true });
	};*/
    //<button className="primary-btn" onClick={handleLogout}>LOGOUT</button>

    const headerText = 'Start \n Cooking'

    return (
        <div className='main-page-container'>
            <div className='header-container'>
                <h1 id='main-header'>{headerText}</h1>
                <img id='home-page-graphic' src={homeGraphic} alt='Chef cooking'/>
            </div>
            <h2>Categories</h2>
            <div className='categories-container'>
                <div className='category-card'>
                    <button className='icon-background active'>
                        <img className='category-icon active' src={allIcon} alt='Icon for all'/>
                    </button>
                    <p className='category-text'>All</p>
                </div>
                <div className='category-card'>
                    <button className='icon-background'>
                        <img className='category-icon' src={allIcon} alt='Icon for all'/>
                    </button>
                    <p className='category-text'>All</p>
                </div>

            </div>
            <div className='header-container'>
                <h2>Recipes</h2>
                <button id='sort-button'>
                    <img id='sort-icon' src={sortIcon} alt='Sort icon'/>
                </button>
            </div>
            <div className='recipe-container'>
                <div className='recipe-card'>
                    <p>text</p>
                </div>
            </div>
            
        </div>
    );
};

export default MainPage;