import '../styles/App.css';
import '../styles/HomePage.css';
import '../styles/RankingPage.css';
import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import recipeService from '../services/recipes';
import categoryService from '../services/categories';
import RankingList from './ranking/RankingList';
import { ReactComponent as RankingGraphic } from '../graphics/ranking_graphic.svg';
import ToggleEdit from './ranking/ToggleEdit';
import RankingInfo from './ranking/RankingInfo';

const RankingPage = () => {

  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState({ranked: [], unranked: []});
  const [activeCategory, setActiveCategory] = useState(null);
  const [isDragDisabled, setIsDragDisabled] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const recipes = await recipeService.getAll();
        setRecipes(recipes);
        const categories = await categoryService.getAll();
        setCategories(categories);
        setActiveCategory(categories.find(cat => cat.name === 'All'));
      } catch (error) { // Problem connecting to the server
        console.log(error);
      }
    })();
  }, []);


  /* Filter recipes based on category */
  useEffect(() => {
    /* don't run the effect before data has been fetched from backend */
    if (!activeCategory) {
      return;
    }

    const filtered = recipes.filter(r => r.categories.map(cat => cat.name).includes(activeCategory.name));
    setFilteredRecipes({
      ranked: activeCategory.rankedRecipes.map(rId => filtered.find(r => r.id === rId)),
      unranked: filtered.filter(r => activeCategory.unrankedRecipes.includes(r.id))
    });
  }, [activeCategory]);
  

  const createCategoryCard = (category) => {
    return (
      <div key={category.name} className='category-card'>
        <button
          className={activeCategory.name === category.name ? 'icon-background active' : 'icon-background'}
          onClick={() => setActiveCategory(category)}
          key={ category.name }
        >
          <img
            className={activeCategory.name === category.name ? 'category-icon active' : 'category-icon'}
            src={require(`../graphics/${category.icon}.svg`)}
            alt={`Icon for category '${category.name}'`}
          />
        </button>
        <p className='category-text'>{category.name}</p>
      </div>
    );
  };


  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (
      !destination || // user dropped the recipe outside of ranking lists
      (destination.droppableId === source.droppableId &&
      destination.index === source.index) // dropped the recipe back into its original position
    ) { 
      return;
    }

    const sourceList = source.droppableId;
    const destList = destination.droppableId;

    if (sourceList === destList) { // user moved the recipe within ranked/unranked
      const newRanking = Array.from(filteredRecipes[sourceList]);
      const [removed] = newRanking.splice(source.index, 1);
      newRanking.splice(destination.index, 0, removed);
      setFilteredRecipes({...filteredRecipes, [sourceList]: newRanking});

      if (sourceList === 'ranked') {
        const updatedRanking = {
          rankedRecipes: newRanking.map(r => r.id)
        };
        const updatedCategory = await categoryService.editRanking(activeCategory.id, updatedRanking);
        setCategories(categories.map(cat => cat.id !== updatedCategory.id ? cat : updatedCategory));
      }

    } else { // moving between ranked and unranked
      const newSourceList = Array.from(filteredRecipes[sourceList]);
      const [removed] = newSourceList.splice(source.index, 1);
      const newDestList = Array.from(filteredRecipes[destList]);
      newDestList.splice(destination.index, 0, removed);
      setFilteredRecipes({[sourceList]: newSourceList, [destList]: newDestList});
      
      const updatedRanking = {
        [`${sourceList}Recipes`]: newSourceList.map(r => r.id),
        [`${destList}Recipes`]: newDestList.map(r => r.id)
      };
      const updatedCategory = await categoryService.editRanking(activeCategory.id, updatedRanking);
      setCategories(categories.map(cat => cat.id !== updatedCategory.id ? cat : updatedCategory));
    }
  };


  return (
    <div className='App ranking-page-container'>
      <div className='header-container'>
        <h1>Ranking</h1>
        <RankingGraphic id='ranking-page-graphic'/>
      </div>
      <div className='header-container'>
        <h2>Categories</h2>
      </div>
      <div className='categories-container'>
        {categories.map(category => createCategoryCard(category))}
      </div>
      <div className='ranking-info-container'>
        <ToggleEdit isDragDisabled={isDragDisabled} setIsDragDisabled={setIsDragDisabled}/>
        <RankingInfo/>
      </div>
      <div className='ranking-lists-container'>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className='ranking-list-container'>
            <div className='header-container'>
              <h2>Ranked</h2>
            </div>
            <RankingList name={'ranked'} recipes={filteredRecipes.ranked} isDragDisabled={isDragDisabled} />
          </div>
          <div className='ranking-list-container'>
            <div className='header-container'>
              <h2>Unranked</h2>
            </div>
            <RankingList name={'unranked'} recipes={filteredRecipes.unranked} isDragDisabled={isDragDisabled} />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default RankingPage;
