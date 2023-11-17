import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/ToggleEdit.css';

const ToggleEdit = ({ isDragDisabled, setIsDragDisabled }) => {

  const handleToggle = () => {
    setIsDragDisabled(!isDragDisabled);
  };

  return (
    <div className='toggle-container'>
      <h2 htmlFor='toggle-edit-mode' className='toggle-label'>Edit mode</h2>  
      <label className="toggle-switch">
        <input
          id='toggle-edit-mode'
          type="checkbox"
          checked={!isDragDisabled}
          onChange={handleToggle}
        />
        <span className="slider">
        </span>
      </label>
    </div>
  );
};

ToggleEdit.propTypes = {
  isDragDisabled: PropTypes.any,
  setIsDragDisabled: PropTypes.any
};

export default ToggleEdit;