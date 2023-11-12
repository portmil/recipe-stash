import '../../styles/App.css';
import '../../styles/Popup.css';
import '../../styles/HomePage.css';
import '../../styles/SortingPopup.css';
import sortIcon from '../../graphics/sort_icon.svg';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import React, { useRef, useState } from 'react';
import listenToScrollResizeClick from '../../hooks/listenToScrollResizeClick';

/* Component for the popup window where the user can adjust
sorting settings for the recipes displayed in the home page */

const SortingPopup = ({ 
  sortBy,
  setSortBy,
  order,
  setOrder }) => {
    
  const sortOptions = ['Alphabetical', 'Cooking time', 'Latest cooking date', 'Ranking', 'Rating'];
  const dirOptions = ['Ascending', 'Descending'];

  /* Temporary variables for setting the select elements,
     these are applied only after the 'Show Recipes' button is pressed */
  const [sortByOption, setSortByOption] = useState(sortBy);
  const [orderOption, setOrderOption] = useState(order);

  const updateSort = () => {
    setSortBy(sortByOption);
    setOrder(orderOption);
  };

  /* Get the position of this pop up (so the button that opens this pop up),
     and use it to configure its position in the desktop view */
  const elementRef = useRef();
  const newPosition = listenToScrollResizeClick(elementRef);

  const top = newPosition.width >= 801 ? newPosition.y + 35 : 'auto';
  const left = newPosition.width >= 801 ? newPosition.x - 280 : 0;

  /* Specify the z-index with js to override the popup library's default value */
  const overlayStyle ={ zIndex: newPosition.width >= 801 ? 101 : 102 };

  return (
    <div ref={elementRef}>
      <div>
        <Popup className='sorting' trigger={ 
          <button id='sort-button' type='button'>
            <img id='sort-icon' src={sortIcon} alt='Sort icon'/>
          </button> } {...{ overlayStyle }} modal nested>
          { close => (
            <div className='content' id='sorting' style={{ top: top, left: left }}>
              <div className='sorting-popup-container'>
                <h3 className='sorting-header'>Sort Recipes</h3>
                <button className='close-popup-button' type='button' onClick={() => {
                  close();
                }}>
                X
                </button>
                <div className='sorting-inputs'>
                  <label className='sort-label' htmlFor='select-sort-by'>Sort by</label>
                  <div id='select-sorting' className='popup-outline-input-container'>
                    <select id='select-sort-by' value={sortByOption} 
                      onChange={({target}) => setSortByOption(target.value)}>
                      {sortOptions.map(option => {
                        return <option key={option}>{option}</option>;
                      })}
                    </select>
                  </div>
                  <label className='sort-label' htmlFor='select-sort-dir'>Sort direction</label>
                  <div id='select-sorting' className='popup-outline-input-container'>
                    <select id='select-sort-dir' value={orderOption} 
                      onChange={({target}) => setOrderOption(target.value)}>
                      {dirOptions.map(dir => {
                        return <option key={dir}>{dir}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <button type='button' id='confirm-btn-popup' className='primary-btn' 
                  onClick={() =>  {
                    updateSort();
                    close();
                  }}>
                SHOW RECIPES
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </div>
  );
};

SortingPopup.propTypes = {
  sortBy: PropTypes.string,
  setSortBy: PropTypes.func,
  order: PropTypes.string,
  setOrder: PropTypes.func
};

export default SortingPopup;