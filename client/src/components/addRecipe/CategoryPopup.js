import '../../styles/App.css';
import '../../styles/AddRecipePage.css';
import '../../styles/Popup.css';
import React, { useState } from 'react';
import categoryIcons from '../../graphics/categoryIcons.js';
import CategoryIcon from './CategoryIcon';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';

/* Get the extra category icons and append them with names.
   Create the names from the category icons' names: cheese_icon.svg -> Cheese
*/
const getExtraIcons = () => {
  const extraIcons = categoryIcons.extraIcons;
  try {
    return extraIcons.map(icon => {
      return {
        name: (icon[0].toUpperCase() + icon.slice(1)).split('_icon.svg')[0].replace('_', ' '), 
        icon: icon.split('.svg')[0]};
    });
  } catch (error) {
    console.log(`There was an error retrieving extra category icons: ${error}`);
  }
};

/* Component to create a new category */

const CategoryPopup = ({ 
  currentCategories,
  addedCategories, 
  setAddedCategories,
  categoryNameMaxLength }) => {

  const extraIconsWithNames = getExtraIcons();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setShowWarningMessage] = useState('');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const selectIcon = (option) => {
    setSelectedIcon(option);
    setIsDropdownOpen(false);
  };

  /* Handle pressing the 'confirm' button. 
     Return true if the adding of a category is successful and the popup should be closed, 
     and return false if the pop up should not be closed */
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
    if (addedCategories.find(object => object.name === newCategoryName)) {
      setErrorMessage('You have already specified a new category with this name');
      setShowError(true);
      return false;
    }
    /* Set the new category name as the text field's input value,
       but get the icon from the selectedIcon
    */
    const newCategory = {
      name: newCategoryName,
      icon: selectedIcon ? selectedIcon.icon : null,
    };
    setAddedCategories([...addedCategories, newCategory]);
    clearPopup();
    return true;
  };

  /* Display a warning message if a user wants to type more than max lengths */
  const showWarningMessage = (target) => {
    if (target.value.length >= categoryNameMaxLength) {
      setShowWarningMessage(`The max length of a category name is ${categoryNameMaxLength} characters`);
      setShowWarning(true);
    }
  };

  /* Display a warning message if a user wants to type more than max length */
  const clearWarningMessage = () => {
    setShowWarningMessage('');
    setShowWarning(false);
  };

  const clearPopup = () => {
    setIsDropdownOpen(false);
    setNewCategoryName('');
    setSelectedIcon(null);
    setErrorMessage('');
    setShowError(false);
    clearWarningMessage();
  };

  return (
    <Popup trigger={ <button type='button' id='add-category-btn' 
      onClick={(event) => event.preventDefault()}>+ Add new category</button> } modal nested>
      { close => (
        <div className='modal'>
          <div className='content'>
            <div className='popup-container'>
              <div className='popup-line-input-container'>
                <input type='text' name='category-name' placeholder=' ' id='category-name'
                  maxLength={categoryNameMaxLength}
                  onKeyDown={({ target }) => showWarningMessage(target)}
                  onBlur={clearWarningMessage}
                  onChange={({ target }) => {
                    clearWarningMessage();
                    setErrorMessage('');
                    setShowError(false);
                    setNewCategoryName(target.value);
                  }}>
                </input>
                <label htmlFor='category-name'>Category name</label>
              </div>
              <div className="dropdown">
                <div className='popup-outline-input-container'>
                  <select id='category-icon' onClick={toggleDropdown}>
                    {/* This option is not a real option, but it is used to define 
                        the drop down menu's label. A select element is used to provide 
                        the drop down menu the same style as a select element */}
                    <option value="" hidden>{selectedIcon ? selectedIcon.name : 'Select an icon'}</option>
                  </select>
                </div>
                {/* The actual drop down menu: */}
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
              {showError && <p className='popup-form-error'>{errorMessage}</p>}
              {showWarning && <p className='popup-form-error'>{warningMessage}</p>}
              <button type='button' id='confirm-btn-popup' className='primary-btn' 
                onClick={(event) =>  {
                  const closePopup = handleAddCategory(event);
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

CategoryPopup.propTypes = {
  addedCategories: PropTypes.array,
  setAddedCategories: PropTypes.func,
  currentCategories: PropTypes.array,
  categoryNameMaxLength: PropTypes.number
};

export default CategoryPopup;