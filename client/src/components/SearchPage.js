import '../styles/App.css';
import '../styles/SearchPage.css';
import React, { useState, useEffect } from 'react';
import { ReactComponent as SearchIcon } from '../graphics/search_icon.svg';
import RecipeCard from './recipeInfo/RecipeCard';
import recipeService from '../services/recipes';
import categoryService from '../services/categories';

const SearchPage = () => {

  const [allRecipes, setAllRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect (() => {
    /* The callback function passed to useEffect() cannot be async, so 
       an immediately invoked function expression has to be used instead */
    (async () => {
      try {
        setAllRecipes(await recipeService.getAll());
        setCategories(await categoryService.getAll());
      } catch (error) { // problem connecting to the server
        console.log(error);
      }
    })();
  }, []);

  /* Sort recipes so that recipes containing the given value in their names 
     are showed first (and recipes searched based on categories are shown last).
     Also, sort recipes based on how early the value is displayed in their name */
  const sortRecipes = (array, value) => {
    array.sort((recipeA, recipeB) => {
      recipeA.name.indexOf(value) < recipeB.name.indexOf(value);
    });
  };

  /* Filter an array of objects based on object name */
  const filterByName = (array, value) => {
    const filteredByName = array.filter(object => {
      return object.name.toLowerCase().includes(value.toLowerCase());
    });
    return filteredByName;
  };

  /* Filter recipes based on input value.
     Clear recipes when the input value is empty */
  const filterRecipes = (value) => {
    const filtered = [];
    if (value) {
      /* Filter by recipe name */
      const filteredByRecipeName = filterByName(allRecipes, value);
      filtered.push(...filteredByRecipeName);
      /* Filter by category name */
      const filteredCategories = filterByName(categories, value);
      filteredCategories.forEach(category => {
        const filteredByCategoryName = allRecipes.filter(recipe => {
          if (!filteredByRecipeName.includes(recipe)) {
            return recipe.categories.find(recipeCategory => recipeCategory.id === category.id);
          }
        });
        filtered.push(...filteredByCategoryName);
      });
      sortRecipes(filtered, value);
    }
    setFilteredRecipes(filtered);
  };

  return (
    <div className='App' id='search-page-container'>
      <h1 id='search-header'>Search</h1>
      <div className='search-bar'>
        <div id='search-input-container'>
          <input className='outline-input' name='search' type='text'
            placeholder='Search' 
            id='search'
            value={searchValue}
            onChange={({ target }) => {
              setSearchValue(target.value);
              filterRecipes(target.value);
            }}>
          </input>
          <SearchIcon id='search-input-icon'/>
        </div>
        <button type='button' className='secondary-btn' onClick={() => {
          setSearchValue('');
          setFilteredRecipes([]);
        }}>
          CLEAR
        </button>
      </div>
      <div className='recipe-container'>
        {filteredRecipes.map((recipe, index) => {
          return (
            <RecipeCard recipe={recipe} key={index}/>
          );
        })}
      </div>
    </div>
  );
};

export default SearchPage;