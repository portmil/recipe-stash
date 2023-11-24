import { useState, useMemo } from 'react';
import { Outlet } from 'react-router-dom';

export const HomePageRoute = () => {
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [activeCategories, setActiveCategories] = useState(['All']);
  const [sortBy, setSortBy] = useState('Latest cooking date');
  const [order, setOrder] = useState('Ascending');

  const value = useMemo(() => (
    { filteredRecipes, setFilteredRecipes,
      activeCategories, setActiveCategories,
      sortBy, setSortBy,
      order, setOrder }
  ), [filteredRecipes, activeCategories, sortBy, order]
  );

  return <Outlet context={value} />;
};

export default HomePageRoute;
