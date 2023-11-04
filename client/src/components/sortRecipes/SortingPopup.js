import '../../styles/App.css';
import '../../styles/Popup.css';
import '../../styles/HomePage.css';
import '../../styles/SortingPopup.css';
import sortIcon from '../../graphics/sort_icon.svg';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import React, { useRef } from 'react';
import listenToScrollResize from '../../hooks/listenToScroll';

/* Component for the popup window where the user can adjust
sorting settings for the recipes displayed in the home page */

const SortingPopup = ({ 
  sortBy,
  setSortBy,
  order,
  setOrder }) => {
    
  const sortOptions = ['Alphabetical', 'Cooking time', 'Latest cooking date', 'Ranking', 'Rating'];
  const dirOptions = ['Ascending', 'Descending'];

  const updateSort = () => {
    const selectedSort = document.querySelector('#select-sort-by').value;
    const selectedDir = document.querySelector('#select-sort-dir').value;
    setSortBy(selectedSort);
    setOrder(selectedDir);
  };

  /* Get the position of this pop up (so the button that opens this pop up),
     and use it to configure its position in the desktop view */
  const elementRef = useRef();
  const newPosition = listenToScrollResize(elementRef);

  const top = newPosition.width >= 801 ? newPosition.y + 35 : 'auto';
  const left = newPosition.width >= 801 ? newPosition.x - 280 : 0;

  return (
    <div ref={elementRef}>
      <div>
        <Popup className='sorting-popup' trigger={ 
          <button id='sort-button' type='button'>
            <img id='sort-icon' src={sortIcon} alt='Sort icon'/>
          </button> } modal nested>
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
                    <select id='select-sort-by'>
                      {sortOptions.map(option => {
                        if (option === sortBy) { // set current selection as default
                          return <option key={option} selected>{option}</option>;
                        } else {
                          return <option key={option}>{option}</option>;
                        }
                      })}
                    </select>
                  </div>
                  <label className='sort-label' htmlFor='select-sort-dir'>Sort direction</label>
                  <div id='select-sorting' className='popup-outline-input-container'>
                    <select id='select-sort-dir'>
                      {dirOptions.map(dir => {
                        if (dir === order) { // set current direction as default
                          return <option key={dir} selected>{dir}</option>;
                        } else {
                          return <option key={dir}>{dir}</option>;
                        }
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