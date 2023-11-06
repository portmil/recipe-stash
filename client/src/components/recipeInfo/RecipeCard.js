import '../../styles/App.css';
import '../../styles/RecipeInfo.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ReactComponent as StarIcon } from '../../graphics/star_icon.svg';

const RecipeCard = ({ recipe }) => {

  const navigate = useNavigate();

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
    <div key={recipe.id} className='recipe-card' onClick={() => navigate(`/recipe/${recipe.id}`)}>
      <div className='recipe-icon-container'>
        <img className='recipe-icon' src={require(`../../graphics/${icon}.svg`)} alt={`Icon for category '${iconName}'`}/>
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

RecipeCard.propTypes = {
  recipe: PropTypes.object,
};

export default RecipeCard;