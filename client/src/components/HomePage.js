import '../styles/App.css';
import '../styles/HomePage.css';
import homeGraphic from '../graphics/home_page_graphic.svg';
import sortIcon from '../graphics/sort_icon.svg';
import allIcon from '../graphics/all_icon.svg';
import { ReactComponent as StarIcon } from '../graphics/star_icon.svg';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const HomePage = () => {

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect (() => {
    // get categories from backend and replace mock data
    setCategories([{icon: 'all_icon', name: 'All'}, {icon: 'breakfast_icon', name: 'Breakfast'}]);

    // get all recipes from backend and replace mock data
    setRecipes([{id: '1', name: 'Spaghetti bolognese', rating: 3}, {id: '2', name: 'Lentil Soup', rating: 0}]);
  }, []);

  const createCategoryCard = (category) => {

    return (
      <div className='category-card'>
        <button
          className={activeCategory === category.name ? 'icon-background active' : 'icon-background'}
          onClick={() => setActiveCategory(category.name)}
          key={ category.name }
        >
          <img
            className={activeCategory === category.name ? 'category-icon active' : 'category-icon'}
            src={require(`../graphics/${category.icon}.svg`)}
            alt='Icon for all'
          />
        </button>
        <p className='category-text'>{category.name}</p>
      </div>
    );
  };

  const createRecipeCard = (recipe) => {
    // convert recipe star rating to an array
    const starArr = [];
    for(let i = 0; i < recipe.rating; i++) {
      starArr.push(<StarIcon key={`${recipe.id}-${i}`} className='star-icon filled'/>);
    }    
    for(let i=recipe.rating; i<5; i++) {
      starArr.push(<StarIcon key={`${recipe.id}-${i}`} className={recipe.rating === 0 ? 'star-icon faded': 'star-icon'}/>);
    }

    return (
      <div className='recipe-card' onClick={() => navigate(`/${recipe.id}`)}>
        <div className='recipe-icon-container'>
          <img className='recipe-icon' src={allIcon} alt='Icon for all'/>
        </div>
        <div className='recipe-text-container'>
          <p>{recipe.name}</p>
          <div className='star-container'>
            {starArr}
          </div>
        </div>
      </div>
    );
  };

  const headerText = 'Start \n Cooking';

  return (
    <div className='main-page-container'>
      <div className='header-container'>
        <h1 id='main-header'>{headerText}</h1>
        <img id='home-page-graphic' src={homeGraphic} alt='Chef cooking'/>
      </div>
      <h2>Categories</h2>
      <div className='categories-container'>
        {categories.map(category => createCategoryCard(category))}
      </div>
      <div className='header-container'>
        <h2>Recipes</h2>
        <button id='sort-button'>
          <img id='sort-icon' src={sortIcon} alt='Sort icon'/>
        </button>
      </div>
      <div className='recipe-container'>
        {recipes.map(recipe => createRecipeCard(recipe))}
      </div>
            
    </div>
  );
};

export default HomePage;