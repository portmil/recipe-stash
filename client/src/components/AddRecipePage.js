import '../styles/App.css';
import '../styles/AddRecipePage.css';
import '../styles/Popup.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySelection from '../components/addRecipe/CategorySelection.js';
import recipeService from '../services/recipes';
import categoryService from '../services/categories';
import { maxLengths } from './addRecipe/constants.js';


const AddRecipePage = () => {

  const navigate = useNavigate();

  /* Properties of a recipe */
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [description, setDescription] = useState('');
  const [lastMakingDate, setDate] = useState('');

  /* Specified categories for the recipe, including new categories */
  const [addedCategories, setAddedCategories] = useState([]);

  const [dateType, setDateType] = useState('text');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [showDescWarning, setShowDescWarning] = useState(false);
  const [warningMessage, setShowWarningMessage] = useState('');

  /* First, the type of the date field is 'text' to display its label.
     When it is clicked the first time, the type changes to 'date'. */
  const handleDateFocus = () => {
    setDateType('date');
    /* If the input is pressed when there is a placeholder, default to today */
    if (!lastMakingDate && dateType === 'text') {
      const today = new Date();
      const formattedDate = today.toISOString().slice(0, 10);
      setDate(formattedDate);
    }
    /* If the input is cleared, set the placeholder back */
    if (!lastMakingDate && dateType === 'date') {
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

  /* Create the recipe, only send properties if they have been defined */
  const addRecipe = async () => {
    const recipe = { 
      ...(name ? { name } : {}), 
      ...(link ? { link } : {}), 
      ...(lastMakingDate ? { lastMakingDate } : {}), 
      ...(description ? { description } : {}), 
      ...(cookingTime ? { cookingTime } : {}),
    };
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
      const response = await addRecipe();
      await createCategories();
      await updateCategories(response.id);
      navigate('/home', { replace: true });
    } catch (exception) {
      const e = exception.response.status === 400 ? exception.response.data.error : exception.message;
      setErrorMessage(`Adding a recipe was not successful. ${e}`);
      setShowError(true);
    }
  };

  /* Display a warning message if a user wants to type more than max lengths */
  const showWarningMessage = (target, input, maxLength) => {
    if (target.value.length >= maxLength) {
      setShowWarningMessage(`The max length of a ${input} is ${maxLength} characters`);
      if (input === 'description') {
        setShowDescWarning(true);
      } else {
        setShowWarning(true);
      }
    }
  };

  const clearWarningMessage = () => {
    setShowWarningMessage('');
    setShowWarning(false);
    setShowDescWarning(false);
  };

  return (
    <div className='App' id='add-recipe-container'>
      <form className='add-recipe-form' onSubmit={handleSubmit}>
        <h1 id='add-recipe-header'>Add Recipe</h1>
        {showError && <p className='add-recipe-form-error'>{errorMessage}</p>}
        {showWarning && <p className='add-recipe-form-error'>{warningMessage}</p>}
        <div className='input-container'>
          <div className='start-form-container'>
            <div className='multiple-line-input-container'>
              <div className='line-input-container'>
                <input type='text' name='name' placeholder=' ' id='name' 
                  maxLength={maxLengths.recipeName}
                  onKeyDown={({ target }) => {
                    showWarningMessage(target, 'recipe name', maxLengths.recipeName);
                  }}
                  onBlur={clearWarningMessage}
                  onChange={({ target }) => {
                    clearWarningMessage();
                    setErrorMessage('');
                    setShowError(false);
                    setName(target.value);
                  }}>
                </input>
                <label htmlFor='name'>Name *</label>
              </div>
              <div className='line-input-container'>
                <input type='link' name='link' placeholder=' ' id='link' 
                  maxLength={maxLengths.link}
                  onKeyDown={({ target }) => {
                    showWarningMessage(target, 'link', maxLengths.link);
                  }}
                  onBlur={clearWarningMessage}
                  onChange={({ target }) => {
                    clearWarningMessage();
                    setLink(target.value);
                  }}>
                </input>
                <label htmlFor='link'>Link</label>
              </div>
              <div className='cooking-time-container'>
                <label htmlFor='cooking-time'>Cooking time (minutes):</label>
                <input className='outline-input' name='cooking-time' type='number'
                  min={0}
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
              categoryNameMaxLength={maxLengths.categoryName}
            />
          </div>
          <div className='end-form-container'>
            <textarea className='outline-input' id="description" name="description" 
              maxLength={maxLengths.description}
              placeholder='Description'
              value={description}
              onKeyDown={({ target }) => {
                showWarningMessage(target, 'description', maxLengths.description);
              }}
              onBlur={clearWarningMessage}
              onChange={({ target }) => {
                clearWarningMessage();
                setDescription(target.value);
              }}>
            </textarea>
            {showDescWarning && <p className='add-recipe-form-error-desc'>{warningMessage}</p>}
            <input className='outline-input' name='cooking-date' type={dateType}
              onFocus={handleDateFocus}
              placeholder='Cooking date' 
              id='cooking-date'
              value={lastMakingDate}
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