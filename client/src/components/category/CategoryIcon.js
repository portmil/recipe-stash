import '../../styles/App.css';
import '../../styles/AddRecipePage.css';
import '../../styles/Popup.css';
import React from 'react';
import PropTypes from 'prop-types';

const CategoryIcon = ({ category, width }) => {
  return (
    <div className='category-icon-background'>
      <img 
        style={{ width: width }}
        src={require(`../../graphics/${category.icon}.svg`)} 
        alt={`Icon for category '${category.name}'`}
      />
    </div>
  );
};

CategoryIcon.propTypes = {
  category: PropTypes.object,
  width: PropTypes.number
};

export default CategoryIcon;