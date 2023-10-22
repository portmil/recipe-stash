import '../styles/App.css';
import '../styles/RecipePage.css';
import '../styles/HomePage.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import recipeService from '../services/recipes';
import { useParams } from 'react-router-dom';
import { ReactComponent as BackIcon } from '../graphics/back_icon.svg';
import { ReactComponent as EditIcon } from '../graphics/edit_icon.svg';
import { ReactComponent as StarIcon } from '../graphics/star_icon.svg';

const RecipePage = () => {

  const {id} = useParams();

  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({});
  const [error, setError] = useState(false);

  useEffect (() => {
    (async () => {
      try {
        var recipe = await recipeService.getRecipe(id);
        // if recipe belongs to multiple categories, drop the category 'All'
        if (recipe.categories.length > 1) {
          recipe = { ...recipe, categories: recipe.categories.slice(1) };
        }
        setRecipe(recipe);
      } catch (error) {
        console.log(error);
        setError(true);
      }
    })();
  }, []);

  const createCategoryCard = (category) => {
    return (
      <div key={category.name} className='category-card'>
        <button
          className={'icon-background active'}
          key={ category.name }
        >
          <img
            className={'category-icon active'}
            src={require(`../graphics/${category.icon}.svg`)}
            alt={`Icon for category '${category.name}'`}
          />
        </button>
        <p className='category-text'>{category.name}</p>
      </div>
    );
  };

  const createCookingDate = () => {
    const date = new Date(recipe.lastMakingDate);
    return (
      <div className='attribute-container'>
        <h3>Cooking date</h3>
        <p className='attribute-text'>{date.toLocaleDateString().replaceAll('/', '.')}</p>
      </div>
    );
  };

  const createStars = () => {
    const starArr = [];
    for(let i = 0; i < recipe.rating; i++) {
      starArr.push(<StarIcon key={`${recipe.id}-${i}`} className='star-rating filled'/>);
    }    
    for(let i=recipe.rating; i<5; i++) {
      starArr.push(<StarIcon key={`${recipe.id}-${i}`} className='star-rating'/>);
    }
    return (
      <div className='rating-container'>
        {starArr}
        <p className='category-text'>{`${recipe.rating}/5`}</p>
      </div>
    );
  };

  const createLink = () => {
    var link = recipe.link;
    if (!link.includes('https://')) {
      link = 'https://'+link;
    }
    return (
      <a href={link} target='_blank' rel='noreferrer' className='attribute-text'>{recipe.link}</a>
    );
  };

  const showError = () => {
    setTimeout(() => {
      navigate('/home');
    }, '5000');
    return (
      <>
        <p>Error: Recipe could not be found</p>
        <p>You will be redirected to the home page</p>
      </>
    );
  };

  return (
    <div className='App recipe-page-container'>
      { error ? showError() :
        <>
          <div className='icon-container'>
            <button className='icon-button' onClick={() => navigate(-1)} >
              <BackIcon className='icon'/>
            </button>
            <button className='icon-button'>
              <EditIcon className='icon'/>
            </button>
          </div>
          <div>
            <h1>{recipe.name}</h1>
            <div className='info-container'>
              <div className='category-container'>
                {recipe.categories && recipe.categories.map(category => createCategoryCard(category))}
              </div>
              {createStars()}
            </div>
          </div>
          <div className='attributes-container'>
            {recipe.link && 
        <div className='attribute-container'>
          <h3>Link</h3>
          {createLink()}
        </div>
            }
            {recipe.description && 
        <div className='attribute-container'>
          <h3>Description</h3>
          <p className='attribute-text'>{recipe.description}</p>
        </div>
            }
            {Date(recipe.lastMakingDate) !== Date(0) && createCookingDate()}
          </div>
          <button className='primary-btn cook-now'>COOK NOW</button>
        </>
      }
    </div>
  );
};

export default RecipePage;
