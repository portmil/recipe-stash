import '../../styles/Popup.css';
import { ReactComponent as TrashIcon } from '../../graphics/trash.svg';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';


/* Component for the popup window that confirms the user
really wants to delete the recipe they are currently editing */

const ConfirmDeletePopup = ({deleteRecipe}) => {
  return (
    <Popup trigger={
      <button className='right-align icon-button'>
        <TrashIcon className='icon'/>
      </button>} position="bottom right"
    >
      { close => (
        <div className='content'>
          <div className='popup-container'>
            <p id='confirm-del-popup-text'>Are you sure you want to <br/> delete this recipe?</p>
            <button type='button' id='confirm-btn-popup' className='primary-btn' 
              onClick={() => deleteRecipe()}>
              DELETE
            </button>
            <button type='button' className='secondary-btn' onClick={close}>
              CANCEL
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
};


ConfirmDeletePopup.propTypes = {
  deleteRecipe: PropTypes.func
};

export default ConfirmDeletePopup;