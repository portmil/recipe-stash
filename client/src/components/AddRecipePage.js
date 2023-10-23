import '../styles/App.css';
import '../styles/AddRecipePage.css';
import '../styles/Popup.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySelection from '../components/addRecipe/CategorySelection.js';
import recipeService from '../services/recipes';
import categoryService from '../services/categories';

const AddRecipePage = () => {

  const navigate = useNavigate();

  /* Properties of a recipe */
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [description, setDescription] = useState('');
  const [cookingDate, setDate] = useState('');

  /* Specified categories for the recipe, including new catgeories */
  const [addedCategories, setAddedCategories] = useState([]);

  const [dateType, setDateType] = useState('text');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /* First, the type of the date field is 'text' to display its label.
     When it is clicked the first time, the type changes to 'date'. */
  const handleDateFocus = () => {
    setDateType('date');
    /* If the input is pressed when there is a placeholder, default to today */
    if (!cookingDate && dateType === 'text') {
      const today = new Date();
      const formattedDate = today.toISOString().slice(0, 10);
      setDate(formattedDate);
    }
    /* If the input is cleared, set the placeholder back */
    if (!cookingDate && dateType === 'date') {
      setDateType('text');
      setDate('');
    }
  };

  /* Create the new categories */
  const createCategories = async () => {
    const newCategories = addedCategories.filter((object) => !object.id);
    for (let i = 0; i < newCategories.length; i++) {
      await categoryService.addCategory(newCategories[i]);
    }
  };

  /* Create the recipe */
  const addRecipe = async () => {
    const recipe = { name, link, description, lastMakingDate: cookingDate, cookingTime };
    console.log(recipe);
    const response = await recipeService.addRecipe(recipe);
    return response;
  };

  /* Link the recipe and the specified categories together */
  const updateCategories = async (recipeId) => {
    const newCurrentCategories = await categoryService.getAll();
    for (let i = 0; i < addedCategories.length; i++) {
      const categoryId = newCurrentCategories.find((object) => object.name === addedCategories[i].name).id;
      await categoryService.addRecipeToCategory(categoryId, recipeId);
    } 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name.length === 0) {
      setErrorMessage('Give a name for the recipe');
      setShowError(true);
      return;
    }
    try {
      await createCategories();
      const response = await addRecipe();
      await updateCategories(response.id);
      navigate('/home', { replace: true });
    } catch (exception) {
      setErrorMessage('Error: Adding a recipe was not successful');
      setShowError(true);
    }
  };

  return (
    <div className='App' id='add-recipe-container'>
      <form className='add-recipe-form' onSubmit={handleSubmit}>
        <h1 id='add-recipe-header'>Add Recipe</h1>
        {showError && <p className='add-recipe-form-error'>{errorMessage}</p>}
        <div className='input-container'>
          <div className='start-form-container'>
            <div className='multiple-line-input-container'>
              <div className='line-input-container'>
                <input type='text' name='name' placeholder=' ' id='name'
                  onChange={({ target }) => {
                    setErrorMessage('');
                    setShowError(false);
                    setName(target.value);
                  }}>
                </input>
                <label htmlFor='name'>Name *</label>
              </div>
              <div className='line-input-container'>
                <input type='link' name='link' placeholder=' ' id='link'
                  onChange={({ target }) => setLink(target.value)}>
                </input>
                <label htmlFor='link'>Link</label>
              </div>
              <div className='cooking-time-container'>
                <label htmlFor='cooking-time'>Cooking time (minutes):</label>
                <input className='outline-input' name='cooking-time' type='number'
                  placeholder=' ' 
                  id='cooking-time'
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}>
                </input>
              </div>
            </div>
            <CategorySelection 
              addedCategories={addedCategories} 
              setAddedCategories={setAddedCategories}
            />
          </div>
          <div className='end-form-container'>
            <textarea className='outline-input' id="description" name="description" 
              placeholder='Description'
              value={description}
              onChange={({ target }) => setDescription(target.value)}> 
            </textarea>
            <input className='outline-input' name='cooking-date' type={dateType}
              onFocus={handleDateFocus}
              placeholder='Cooking date' 
              id='cooking-date'
              value={cookingDate}
              onChange={(e) => setDate(e.target.value)}>
            </input>
          </div>
        </div>
        <div className='button-container'>
          <button type='button' className='secondary-btn' onClick={() => navigate(-1)}>
            CANCEL
          </button>
          <button type='submit' className='primary-btn' id='confirm-form-btn'>
            CONFIRM
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipePage;