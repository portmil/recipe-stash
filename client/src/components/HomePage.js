import '../styles/App.css';
import '../styles/HomePage.css';
import homeGraphic from '../graphics/home_page_graphic.svg';
import sortIcon from '../graphics/sort_icon.svg';
import { ReactComponent as StarIcon } from '../graphics/star_icon.svg';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import recipeService from '../services/recipes';
import categoryService from '../services/categories';

const HomePage = () => {

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect (() => {
    // the callback function passed to useEffect() cannot be async, so 
    // an immediately invoked function expression has to be used instead
    (async () => {
      try {
        const recipes = await recipeService.getAll();
        setRecipes(recipes);
        const categories = await categoryService.getAll();
        setCategories(categories);
      } catch (error) { // problem connecting to the server
        console.log(error);
      }
    })();
  }, []);

  const createCategoryCard = (category) => {
    return (
      <div key={category.name} className='category-card'>
        <button
          className={activeCategory === category.name ? 'icon-background active' : 'icon-background'}
          onClick={() => setActiveCategory(category.name)}
          key={ category.name }
        >
          <img
            className={activeCategory === category.name ? 'category-icon active' : 'category-icon'}
            src={require(`../graphics/${category.icon}.svg`)}
            alt={`Icon for category '${category.name}'`}
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

    // if recipe belongs to multiple categories, use the icon of the first one other than 'All'
    const icon = recipe.categories.length > 1 ? recipe.categories[1].icon : 'all_icon';
    const iconName = recipe.categories.length > 1 ? recipe.categories[1].name : 'All';

    return (
      <div key={recipe.id} className='recipe-card' onClick={() => navigate(`/${recipe.id}`)}>
        <div className='recipe-icon-container'>
          <img className='recipe-icon' src={require(`../graphics/${icon}.svg`)} alt={`Icon for category '${iconName}'`}/>
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