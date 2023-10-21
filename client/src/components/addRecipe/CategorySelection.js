import '../../styles/App.css';
import '../../styles/AddRecipePage.css';
import '../../styles/Popup.css';
import categoryService from '../../services/categories';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as TrashIcon } from '../../graphics/trash.svg';
import CategoryPopup from './CategoryPopup';
import CategoryIcon from '../category/CategoryIcon';

const CategorySelection = ({ categories, setCategories }) => {

  const [category, setCategory] = useState('');
  const [currentCategories, setCurrentCategories] = useState([]);

  useEffect(() => {
    categoryService.getAll()
      .then((data) => {
        const filteredCategories = data.filter(object => object.name !== 'All');
        const selectCatgeories = [{name: 'Category'}, ...filteredCategories];
        setCurrentCategories(selectCatgeories);
      })
      .catch((e) => console.log(e.message));
  }, []);

  const handleAddCatgeory = ({ target }) => {
    const category = currentCategories.find(object => object.name === target.value);
    if (!categories.find(object => object.name === category.name)) {
      setCategory(category);
      setCategories([...categories, category]);
    }
  };

  const removeCategory = (index) => {
    const currentAdded = [...categories];
    currentAdded.splice(index, 1);
    setCategories(currentAdded);
  };

  return (
    <div className='categories-input-container'>
      <div className='outline-input-container'>
        <select type='category' name='category' placeholder='Category' id='category' value={category}
          onChange={handleAddCatgeory}>
          { currentCategories.map((category, index) => {
            return (
              <option value={category.name} key={index}>{category.name}</option>
            );
          })}
        </select>
      </div>
      <CategoryPopup categories={categories} setCategories={setCategories} currentCategories={currentCategories}/>
      { categories.map((category, index) => {
        return (
          <div className='category-container' key={index}>
            <div className='category-info'>
              { category.icon ? <CategoryIcon category={category} width={30}/> : <div style={{ width: 40 }}/> }
              <p className='category-text'>{category.name}</p>
            </div>
            <button className='remove-category-btn' onClick={() => removeCategory(index)}>
              <TrashIcon alt={'Icon for a trash can'}/>
            </button>
          </div>
        );
      })}
    </div>
  );
};

CategorySelection.propTypes = {
  categories: PropTypes.array,
  setCategories: PropTypes.func
};

export default CategorySelection;