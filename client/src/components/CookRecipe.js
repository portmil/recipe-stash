import '../styles/Popup.css';
import '../styles/CookRecipe.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import StarRating from './rateRecipe/StarRating';
import recipeService from '../services/recipes';

const CookRecipe = ({ currentRating, id }) => {

  const navigate = useNavigate();

  const [lastMakingDate, setLastMakingDate] = useState('');
  const [rating, setRating] = useState(0);

  useEffect (() => {
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);
    setLastMakingDate(formattedDate);
    setRating(currentRating);
  }, [currentRating]);

  const handleConfirm = async () => {
    try {
      const updatedRecipe = {
        lastMakingDate,
        rating
      };
      await recipeService.editRecipe(id, updatedRecipe);
      navigate(0);
    } catch (exception) {
      console.log(exception);
    }
  };

  const clearPopup = () => {
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);
    setLastMakingDate(formattedDate);
    setRating(currentRating);
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
                value={lastMakingDate}
                onChange={(e) => setLastMakingDate(e.target.value)}>
              </input>
              <label className='popup-label' htmlFor='rating-container-cook'>Rating</label>
              <div id='rating-container-cook'>
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
                clearPopup();
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
  currentRating: PropTypes.number,
  id: PropTypes.string
};

export default CookRecipe;