import '../../styles/App.css';
import '../../styles/AddRecipePage.css';
import '../../styles/Popup.css';
import React, { useState } from 'react';
import categoryIcons from '../../graphics/categoryIcons.js';
import CategoryIcon from '../category/CategoryIcon';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';

const getExtraIcons = () => {
  const extraIcons = categoryIcons.extraIcons;
  try {
    return extraIcons.map(icon => {
      return {name: (icon[0].toUpperCase() + icon.slice(1)).split('_icon.svg')[0].replace('_', ' '), icon: icon.split('.svg')[0]};
    });
  } catch (error) {
    console.log(`There was an error retrieving extra category icons: ${error}`);
  }
};

const CategoryPopup = ({ categories, setCategories, currentCategories }) => {

  const extraIconsWithNames = getExtraIcons();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const selectIcon = (option) => {
    setSelectedIcon(option);
    setIsDropdownOpen(false);
  };

  const handleAddCategory = () => {
    if (newCategoryName.length === 0) {
      setErrorMessage('Give a name for the new category');
      setShowError(true);
      return false;
    }
    if (currentCategories.find(object => object.name === newCategoryName)) {
      setErrorMessage('You already have a category with this name');
      setShowError(true);
      return false;
    }
    if (categories.find(object => object.name === newCategoryName)) {
      setErrorMessage('You have already specified a new category with this name');
      setShowError(true);
      return false;
    }
    const newCategory = {
      name: newCategoryName,
      icon: selectedIcon ? selectedIcon.icon : null,
    };
    setCategories([...categories, newCategory]);
    clearPopup();
    return true;
  };

  const clearPopup = () => {
    setIsDropdownOpen(false);
    setNewCategoryName('');
    setSelectedIcon(null);
    setErrorMessage('');
    setShowError(false);
  };

  return (
    <Popup trigger={ <button id='add-category-btn' onClick={(event) => event.preventDefault()}>+ Add new category</button> } modal nested>
      { close => (
        <div className='modal'>
          <div className='content'>
            <div className='popup-container'>
              <div className='popup-line-input-container'>
                <input type='text' name='name' placeholder=' ' id='name'
                  onChange={({ target }) => setNewCategoryName(target.value)}>
                </input>
                <label htmlFor='name'>Category name</label>
              </div>
              <div className="dropdown">
                <div className='outline-input-container'>
                  <select className='popup-outline-input-container' id='category-icon' onClick={toggleDropdown}>
                    <option value="" hidden>{selectedIcon ? selectedIcon.name : 'Select an icon'}</option>
                  </select>
                </div>
                <ul className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
                  { extraIconsWithNames.map((icon, index) => {
                    return (
                      <li key={index} onClick={() => selectIcon(icon)}>
                        <CategoryIcon category={icon} width={25}/>
                      </li>
                    );})}
                </ul>
              </div>
              { selectedIcon && 
                <div className='own-category-container'>
                  <CategoryIcon category={selectedIcon} width={25}/>
                </div>
              }
              {showError && <p className='form-error'>{errorMessage}</p>}
              <button id='confirm-btn-popup'
                className='primary-btn' onClick={(event) =>  {
                  const closePopup = handleAddCategory(event);
                  if (closePopup) close();
                }}>
                CONFIRM
              </button>
              <button className='secondary-btn' onClick={() => {
                clearPopup();
                close();  // The pop up can be closed whenever from the 'Cancel' button
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

CategoryPopup.propTypes = {
  categories: PropTypes.array,
  setCategories: PropTypes.func,
  currentCategories: PropTypes.array
};

export default CategoryPopup;