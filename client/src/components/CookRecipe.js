import '../styles/Popup.css';
import '../styles/CookRecipe.css';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import StarRating from './rateRecipe/StarRating';

const CookRecipe = ({ currentRating }) => {

  const [cookingDate, setCookingDate] = useState('');
  const [rating, setRating] = useState(0);

  useEffect (() => {
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);
    setCookingDate(formattedDate);
    setRating(currentRating);
  }, [currentRating]);

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
                <StarRating rating={rating} setRating={setRating} />
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