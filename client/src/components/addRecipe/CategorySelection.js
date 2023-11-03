import '../../styles/App.css';
import '../../styles/AddRecipePage.css';
import '../../styles/Popup.css';
import categoryService from '../../services/categories';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as TrashIcon } from '../../graphics/trash.svg';
import CategoryPopup from './CategoryPopup';
import CategoryIcon from './CategoryIcon';

/* Component to select from existing categories and to create new ones */

const CategorySelection = ({ 
  addedCategories, 
  setAddedCategories,
  categoryNameMaxLength }) => {

  const [category, setCategory] = useState('');                   // Chosen category
  const [currentCategories, setCurrentCategories] = useState([]); // Existing categories

  useEffect(() => {
    categoryService.getAll()
      .then((data) => {
        /* Get the existing categories. 
           Don't provide the 'All' category as an option.
           Add a 'Category' option to display the input's label */
        const filteredCategories = data.filter(object => object.name !== 'All');
        const selectCatgeories = [{name: 'Category'}, ...filteredCategories];
        setCurrentCategories(selectCatgeories);
      })
      .catch((e) => console.log(e.message));
  }, []);

  /* Get the category based on the selected name */
  const handleAddCatgeory = ({ target }) => {
    const category = currentCategories.find(object => object.name === target.value);
    if (!addedCategories.find(object => object.name === category.name)) {
      setCategory(category);
      setAddedCategories([...addedCategories, category]);
    }
  };

  const removeCategory = (index) => {
    const currentAdded = [...addedCategories];
    currentAdded.splice(index, 1);
    setAddedCategories(currentAdded);
  };

  return (
    <div className='categories-input-container'>
      <div className='outline-input-container' id='category-select'>
        <select type='category' name='category' placeholder='Category' 
          id='category' 
          value={category}
          onChange={handleAddCatgeory}>
          { currentCategories.map((category, index) => {
            return (
              <option value={category.name} key={index}>{category.name}</option>
            );
          })}
        </select>
      </div>
      <CategoryPopup 
        currentCategories={currentCategories} addedCategories={addedCategories} 
        setAddedCategories={setAddedCategories} categoryNameMaxLength={categoryNameMaxLength}/>
      { addedCategories.map((category, index) => {
        return (
          <div className='selected-category-container' key={index}>
            <div className='category-info'>
              <CategoryIcon category={category} width={30}/>
              <p className='category-text'>{category.name}</p>
            </div>
            <button type='button' className='remove-category-btn' 
              onClick={() => removeCategory(index)}>
              <TrashIcon alt={'Icon for a trash can'}/>
            </button>
          </div>
        );
      })}
    </div>
  );
};

CategorySelection.propTypes = {
  addedCategories: PropTypes.array,
  setAddedCategories: PropTypes.func,
  categoryNameMaxLength: PropTypes.number
};

export default CategorySelection;