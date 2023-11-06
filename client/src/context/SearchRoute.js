import { useState, useMemo } from 'react';
import { Outlet } from 'react-router-dom';

export const SearchRoute = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const value = useMemo(() => (
    { searchValue, setSearchValue,
      filteredRecipes, setFilteredRecipes }
  ), [searchValue, filteredRecipes]
  );

  return <Outlet context={value} />;
};

export default SearchRoute;