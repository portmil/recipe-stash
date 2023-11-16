import '../styles/App.css';
import '../styles/ProfilePage.css';
import 'react-tooltip/dist/react-tooltip.css';
import { useNavigate } from 'react-router-dom';
import { React, useState, useEffect } from 'react';
import LogoutIcon from '../graphics/logout_icon.svg';
import { ReactComponent as UserIcon } from '../graphics/user_icon.svg';
import { ReactComponent as RecipesAddedIcon } from '../graphics/recipes_added_icon.svg';
import { ReactComponent as RecipesCookedIcon } from '../graphics/recipes_cooked_icon.svg';
import recipeService from '../services/recipes.js';
import { Tooltip } from 'react-tooltip';

const ProfilePage = () => {

  const navigate = useNavigate();

  const user = JSON.parse(window.localStorage.getItem('user'));

  const [recipes, setRecipes] = useState([]);
  const [cookedRecipes, setCookedRecipes] = useState([]);

  useEffect(() => {
    /* The callback function passed to useEffect() cannot be async, so 
       an immediately invoked function expression has to be used instead */
    (async () => {
      try {
        const recipes = await recipeService.getAll();
        setRecipes(recipes);
        setCookedRecipes(recipes.filter(recipe => {
          return new Date(recipe.lastMakingDate).toLocaleDateString() !== new Date(0).toLocaleDateString();
        }));
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem('user');
    navigate(0, { replace: true });
  };

  return (
    <div className='profile-page-container'>
      <button className='logout-button' onClick={handleLogout}
        data-tooltip-id="my-tooltip" data-tooltip-content="Logout">
        <Tooltip id="my-tooltip" place='bottom'/>
        <img 
          src={LogoutIcon} 
          alt={'Logout icon'}
        />
      </button>
      <div className='user-info'>
        <UserIcon/>
        <div className='user-text-container'>
          <h1 className='user-text'>{user.name}</h1>
          <p className='user-text'>{user.email}</p>
        </div>
      </div>
      <div className='user-recipe-info'>
        <div className='summary-box'>
          <RecipesAddedIcon className='user-recipe-icon'/>
          <p className='user-recipe-text'>{recipes.length}</p>
          <p className='user-recipe-text'>
            Recipes<br/>added
          </p>
        </div>
        <div className='summary-box'>
          <RecipesCookedIcon className='user-recipe-icon'/>
          <p className='user-recipe-text'>{cookedRecipes.length}</p>
          <p className='user-recipe-text'>
            Recipes<br/>cooked
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
