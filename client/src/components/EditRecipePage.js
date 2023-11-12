import '../styles/App.css';
import '../styles/AddRecipePage.css';
import '../styles/EditRecipePage.css';
import '../styles/Popup.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmDeletePopup from './editRecipe/ConfirmDeletePopup';
import CategorySelection from '../components/addRecipe/CategorySelection.js';
import StarRating from './rateRecipe/StarRating.js';
import recipeService from '../services/recipes';
import categoryService from '../services/categories';
import { maxLengths } from './addRecipe/constants.js';


const EditRecipePage = () => {
  
  const [recipe, setRecipe] = useState({});
  const [accessError, setAccessError] = useState(false); // error when fetching the recipe

  const {id} = useParams();
  const navigate = useNavigate();

  useEffect (() => {
    (async () => {
      try {
        // Get the recipe and populate form fields with its current attributes
        let recipe = await recipeService.getRecipe(id);
        // Drop the category 'All'
        recipe = { ...recipe, categories: recipe.categories.slice(1) };
        setRecipe(recipe);
        setName(recipe.name);
        setLink(recipe.link);
        setCookingTime(recipe.cookingTime);
        setDescription(recipe.description);
        setRating(recipe.rating);
        
        // Set the current categories of the recipe
        setAddedCategories(recipe.categories);
      } catch (error) {
        console.log(error);
        setAccessError(true);
      }
    })();
  }, []);

  /* Properties of the recipe */
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);

  /* Categories of the recipe, including new categories */
  const [addedCategories, setAddedCategories] = useState([]);

  /* Errors when editing the recipe */
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [showDescWarning, setShowDescWarning] = useState(false);
  const [warningMessage, setShowWarningMessage] = useState('');

  /* Delete the recipe */
  const deleteRecipe = async () => {
    await recipeService.deleteRecipe(recipe.id);
    navigate('/home');
  };

  /* Update the recipe */
  const editRecipe = async () => {
    const updatedRecipe = {
      name,
      link,
      description,
      cookingTime,
      rating
    };
    const response = await recipeService.editRecipe(recipe.id, updatedRecipe);
    return response;
  };

  /* Create the new categories */
  const createCategories = async () => {
    const newCategories = addedCategories.filter((object) => !object.id);
    for (const newCat of newCategories) {
      await categoryService.addCategory(newCat);
    }
  };

  /* Link the recipe and its new categories together and
  unlink the recipe from categories it was deleted from */
  const updateCategories = async (recipeId) => {
    const allCategories = await categoryService.getAll();
    const currentCatIdsOfRecipe = recipe.categories.map(c => c.id);
    const newCategories = addedCategories.filter(cat => !currentCatIdsOfRecipe.includes(cat.id));
    const deletedCategoriesIds = currentCatIdsOfRecipe.filter(id => !addedCategories.map(cat => cat.id).includes(id));
    // Link new categories
    for (const newCat of newCategories) {
      const categoryId = allCategories.find((object) => object.name === newCat.name).id;
      await categoryService.addRecipeToCategory(categoryId, recipeId);
    }
    // Unlink deleted categories
    for (const categoryId of deletedCategoriesIds) {
      await categoryService.deleteRecipeFromCategory(categoryId, recipeId);
    }
  };

  /* Event handler for confirm button */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name.length === 0) {
      setErrorMessage('Give a name for the recipe');
      setShowError(true);
      return;
    }
    try {
      const editedRecipe = await editRecipe();
      await createCategories();
      await updateCategories(editedRecipe.id);
      navigate(`/recipe/${recipe.id}`, { state: 'edit' });
    } catch (exception) {
      const e = exception.response.status === 400 ? exception.response.data.error : exception.message;
      setErrorMessage(`Editing a recipe was not successful. ${e}`);
      setShowError(true);
    }
  };

  /* Display a warning message if the user tries to type more than max lengths */
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

  /* Display an error if the user is trying to edit a recipe that does not exist
     or a recipe owned by another user */
  const showAccessError = () => {
    setTimeout(() => {
      navigate('/home');
    }, '5000');
    return (
      <>
        <p>Error: Recipe could not be found</p>
        <p>You will be redirected to the home page</p>
      </>
    );
  };

  return (
    <div className='App' id='edit-recipe-container'>
      { accessError ? showAccessError() : <>
        <ConfirmDeletePopup deleteRecipe={deleteRecipe} />
        <form className='edit-recipe-form' onSubmit={handleSubmit}>
          <h1 id='edit-recipe-header'>Edit recipe</h1>
          {showError && <p className='edit-recipe-form-error'>{errorMessage}</p>}
          {showWarning && <p className='edit-recipe-form-error'>{warningMessage}</p>}
          <div className='input-container'>
            <div className='start-form-container'>
              <div className='multiple-line-input-container'>
                <div className='line-input-container'>
                  <input type='text' name='name' value={name} id='name'
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
                  <input type='link' name='link' value={link} id='link' 
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
                    min={1}
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
              {showDescWarning && <p className='edit-recipe-form-error-desc'>{warningMessage}</p>}
              <div id='rating-container'>
                <label>Rating &emsp;</label>
                <div>
                  <StarRating rating={rating} setRating={setRating} />
                </div>
              </div>
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
      </>}
    </div>
  );
};

export default EditRecipePage;