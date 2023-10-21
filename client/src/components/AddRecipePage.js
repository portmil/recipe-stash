import '../styles/App.css';
import '../styles/AddRecipePage.css';
import '../styles/Popup.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySelection from '../components/addRecipe/CategorySelection.js';

const AddRecipePage = () => {

  const navigate = useNavigate();

  /* Properties of a recipe */
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [cookingDate, setDate] = useState('');

  const [dateType, setDateType] = useState('text');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /* First, the type of the date field is 'text' to display its label.
     When it is clicked the first time, the type changes to 'date'. */
  const handleDateFocus = () => {
    setDateType('date');
    if (!cookingDate) {
      const today = new Date();
      const formattedDate = today.toISOString().slice(0, 10);
      setDate(formattedDate);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (event.nativeEvent.submitter.id === 'confirm-form-btn' && name.length === 0) {
      setErrorMessage('Give a name for the recipe');
      setShowError(true);
      return;
    }
    try {
      const recipe = {
        name, link, cookingTime, categories, description, cookingDate
      };
      /*localStorage.setItem('user', JSON.stringify(user));
      navigate('/home', { replace: true });
      */
      console.log(recipe);
    } catch (exception) {
      setErrorMessage('Error: Adding a recipe was not successful');
      setShowError(true);
    }
  };

  return (
    <div className='App' >
      <h1 id='add-recipe-header'>Add Recipe</h1>
      <form className='add-recipe-form' onSubmit={handleSubmit}>
        {showError && <p className='form-error'>{errorMessage}</p>}
        <div className='input-container'>
          <div className='line-input-container'>
            <input type='text' name='name' placeholder=' ' id='name'
              onChange={({ target }) => setName(target.value)}>
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
              onFocus={handleDateFocus}
              placeholder=' ' 
              id='cooking-time'
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}>
            </input>
          </div>
        </div>
        <CategorySelection categories={categories} setCategories={setCategories}/>
        <textarea className='outline-input' id="description" name="description" placeholder='Description'
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
        <div className='button-container'>
          <button className='secondary-btn' onClick={() => navigate(-1)} >CANCEL</button>
          <button type='submit' className='primary-btn' id='confirm-form-btn'>CONFIRM</button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipePage;