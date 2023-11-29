import '../styles/App.css';
import '../styles/HomePage.css';
import homeGraphic from '../graphics/home_page_graphic.svg';
import SortingPopup from './sortRecipes/SortingPopup';
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import recipeService from '../services/recipes';
import categoryService from '../services/categories';
import RecipeCard from './recipeInfo/RecipeCard';

/* Filtering and sorting is enabled on the home page. If the recipes are filtered, they 
   need to be sorted afterwards. If the recipes are sorted, no other actions need to be taken.
   The recipes shown are always sorted, which is why the variable 'sortedRecipes' is used. */

const HomePage = () => {
  
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [sortedRecipes, setSortedRecipes] = useState([]);

  const { 
    filteredRecipes, setFilteredRecipes,
    activeCategories, setActiveCategories,
    sortBy, setSortBy,
    order, setOrder,  
  } = useOutletContext();

  useEffect(() => {
    /* The callback function passed to useEffect() cannot be async, so 
       an immediately invoked function expression has to be used instead */
    (async () => {
      try {
        /* Get all recipes and categories, set the filtered and sorted recipes 
           based on 'activeCategories', 'sortBy' and 'order' */
        const recipes = await recipeService.getAll();
        setRecipes(recipes);
        const categories = await categoryService.getAll();
        setCategories(categories);
        const filtered = filterRecipes(activeCategories, recipes);
        setSortedRecipes(sortRecipes(sortBy, order, filtered));
      } catch (error) { // Problem connecting to the server
        console.log(error);
      }
    })();
  }, []);

  /* Add a category to 'activeCategories' if it isn't there already, and remove a category from 
     activeCategories if it is there. But keep at least one category in 'activeCategories' */
  const updateActiveCategories = (categoryName) => {
    let actives = [];
    if (categoryName === 'All') {
      actives = ['All'];
    } else {
      if (!activeCategories.includes(categoryName)) {
        /* Remove the 'All' category if a new one is specified */
        const newActiveCategories = [...activeCategories];
        const index = newActiveCategories.indexOf('All');
        if (index !== -1) {
          newActiveCategories.splice(index, 1);
        }
        actives = [...newActiveCategories, categoryName];
      } else {
        /* If the active categories are cleared, set them to 'All' */
        if (activeCategories.length === 1 && !activeCategories.includes('All')) {
          actives = ['All'];
        } else {
          const newActiveCategories = [...activeCategories];
          const index = newActiveCategories.indexOf(categoryName);
          newActiveCategories.splice(index, 1);
          actives = newActiveCategories;
        }
      }
    }
    /* Use the 'actives' value right away to complete filtering, 
       but also store it to the state */
    setActiveCategories(actives);
    const filtered = filterRecipes(actives);
    sortRecipes(sortBy, order, filtered);
  };

  /* Filter recipes based on the active categories */
  const filterRecipes = (actives, currentRecipes = recipes) => {
    const filtered = currentRecipes.filter(recipe => {
      return actives.reduce((accumulator, category) => {
        return accumulator && recipe.categories.map(cat => cat.name).includes(category);
      }, true);
    });
    /* Use the 'filtered' value right away to complete sorting, 
       but also store it to the state */
    setFilteredRecipes(filtered);
    return filtered;
  };

  /* Sort based on ascending order. By default, 
     the most recently made recipe is displayed last */
  const sortRecipes = (sortByOption, orderOption, currentFiltered = filteredRecipes) => {
    let sorted = [];
    switch (sortByOption) {
      case 'Alphabetical':
        sorted = currentFiltered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Cooking time':
        sorted = currentFiltered.sort((a, b) =>
          (typeof a.cookingTime === 'number' ? a.cookingTime : Infinity) -
          (typeof b.cookingTime === 'number' ? b.cookingTime : Infinity)
        );
        break;
      case 'Rating':
        sorted = currentFiltered.sort((a, b) => a.rating - b.rating);
        break;
      default:
        sorted = currentFiltered.sort((a, b) => new Date(a.lastMakingDate) - new Date(b.lastMakingDate));
    }
    /* Flip the order if the user has chosen descending order */
    const recipesToShow = orderOption === 'Descending' ? sorted.reverse() : sorted;
    /* Store the 'sorted' value to the state aka the recipes to be showed */
    setSortedRecipes(recipesToShow);
    return sorted;
  };

  const createCategoryCard = (category) => {
    return (
      <div key={category.name} className='category-card'>
        <button
          className={activeCategories.includes(category.name) ? 'icon-background active' : 'icon-background'}
          onClick={() => updateActiveCategories(category.name)}
          key={ category.name }>
          <img
            className={activeCategories.includes(category.name) ? 'category-icon active' : 'category-icon'}
            src={require(`../graphics/${category.icon}.svg`)}
            alt={`Icon for category '${category.name}'`}
          />
        </button>
        <p className='category-text'>{category.name}</p>
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
        <SortingPopup sortRecipes={sortRecipes} sortBy={sortBy} setSortBy={setSortBy} order={order} setOrder={setOrder}/>
      </div>
      <div className='recipe-container'>
        {sortedRecipes.map((recipe, index) => {
          return (
            <RecipeCard recipe={recipe} key={index}/>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;