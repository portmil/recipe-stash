import '../../styles/CookRecipe.css';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as StarIcon } from '../../graphics/star_icon.svg';

const StarRating = ({ rating, setRating }) => {

  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = Array(5).fill(0);

  const handleStarClick = value => {
    setRating(value);
  };

  const handleMouseOver = newHoverValue => {
    setHoverValue(newHoverValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  return (
    <>
      {stars.map((_, index) => {
        return (
          <StarIcon
            key={index}
            size={24}
            onClick={() => handleStarClick(index + 1)}
            onMouseOver={() => handleMouseOver(index + 1)}
            onMouseLeave={handleMouseLeave}
            className={(hoverValue || rating) > index ? 'cook-now-rating filled' : 'cook-now-rating'}
          />
        );
      })}
    </>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number,
  setRating: PropTypes.any
};

export default StarRating;