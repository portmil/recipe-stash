import '../../styles/App.css';
import '../../styles/AddRecipePage.css';
import '../../styles/Popup.css';
import React from 'react';
import PropTypes from 'prop-types';

/* Component to display a category icon with a red background.
   If the given category does not have an icon property, 
   the 'All' category icon is displayed. */

const CategoryIcon = ({ category }) => {
  const categoryIcon = category.icon !== null ? category.icon : 'all_icon';
  return (
    <div className='category-icon-background'>
      <img 
        src={require(`../../graphics/${categoryIcon}.svg`)} 
        alt={`Icon for category '${category.name}'`}
      />
    </div>
  );
};

CategoryIcon.propTypes = {
  category: PropTypes.object
};

export default CategoryIcon;