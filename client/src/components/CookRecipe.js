import '../styles/Popup.css';
import '../styles/CookRecipe.css';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import { ReactComponent as StarIcon } from '../graphics/star_icon.svg';

const CookRecipe = ({ currentRating }) => {

  const [cookingDate, setCookingDate] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = Array(5).fill(0);

  useEffect (() => {
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);
    setCookingDate(formattedDate);
    setRating(currentRating);
  }, [currentRating]);

  const handleStarClick = value => {
    setRating(value);
  };

  const handleMouseOver = newHoverValue => {
    setHoverValue(newHoverValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  const handleConfirm = () => {
    console.log(cookingDate);
    console.log(rating);
  };

  return (
    <Popup trigger={ <button className='primary-btn cook-now'>COOK NOW</button> } modal nested>
      {close => (
        <div className='modal'>
          <div className='content'>
            <div className='popup-container'>
              <label className='popup-label' htmlFor='cooking-date-input'>Cooking date</label>
              <input className='outline-input' name='cooking-date' type='date'
                id='cooking-date-input'
                value={cookingDate}
                onChange={(e) => setCookingDate(e.target.value)}>
              </input>
              <label className='popup-label' htmlFor='rating-container'>Rating</label>
              <div id='rating-container'>
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
              </div>
              <button type='button' id='confirm-btn-popup' className='primary-btn' 
                onClick={() =>  {
                  const closePopup = handleConfirm();
                  if (closePopup) close();
                }}>
                CONFIRM
              </button>
              <button type='button' className='secondary-btn' onClick={() => {
                close();
              }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
};


CookRecipe.propTypes = {
  currentRating: PropTypes.number
};

export default CookRecipe;