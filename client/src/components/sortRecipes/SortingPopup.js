import '../../styles/Popup.css';
import sortIcon from '../../graphics/sort_icon.svg';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';


/* Component for the popup window where the user can adjust
sorting settings for the recipes displayed in the home page */

const SortingPopup = ({ 
  sortBy,
  setSortBy,
  order,
  setOrder }) => {
    
  const sortOptions = ['Alphabetical', 'Cooking time', 'Latest cooking date', 'Ranking', 'Rating'];
  const dirOptions = ['Ascending', 'Descending'];

  const updateSort = () => {
    const selectedSort = document.querySelector('#select-sort-by').value;
    const selectedDir = document.querySelector('#select-sort-dir').value;
    setSortBy(selectedSort);
    setOrder(selectedDir);
  };

  // TODO delete and replace with a proper style
  const closeButtonStyle = {
    position: 'absolute',
    top: '30px',
    right: '30px'
  };


  return (
    <>
      <div id='sorting-popup-desktop'>
        <Popup  trigger={
          <button id='sort-button'>
            <img id='sort-icon' src={sortIcon} alt='Sort icon'/>
          </button>} position="bottom right"
        >
          { close => (
            <div className='content'>
              <div className='popup-container'>
                Sort recipes
                <button style={closeButtonStyle} type='button' onClick={() => {
                  close();
                }}>
                  X
                </button>
                <div className='popup-line-input-container'>
                  <label>Sort by</label>
                </div>
                <div className='dropdown'>
                  <div className='popup-outline-input-container'>
                    <select id='select-sort-by'>
                      {sortOptions.map(option => {
                        if (option === sortBy) { // set current selection as default
                          return <option key={option} selected>{option}</option>;
                        } else {
                          return <option key={option}>{option}</option>;
                        }
                      })}
                    </select>
                  </div>
                </div>
                <div className='popup-line-input-container'>
                  <label>Sort direction</label>
                </div>
                <div className='dropdown'>
                  <div className='popup-outline-input-container'>
                    <select id='select-sort-dir'>
                      {dirOptions.map(dir => {
                        if (dir === order) { // set current direction as default
                          return <option key={dir} selected>{dir}</option>;
                        } else {
                          return <option key={dir}>{dir}</option>;
                        }
                      })}
                    </select>
                  </div>
                </div>
                <button type='button' id='confirm-btn-popup' className='primary-btn' 
                  onClick={() =>  {
                    updateSort();
                    close();
                  }}>
                  SHOW RECIPES
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>

      <div id='sorting-popup-mobile'>
        <Popup trigger={
          <button id='sort-button'>
            <img id='sort-icon' src={sortIcon} alt='Sort icon'/>
          </button>} modal
        >
          { close => (
            <div className='content'>
              <div className='popup-container'>
                Sort recipes
                <button style={closeButtonStyle} type='button' onClick={() => {
                  close();
                }}>
                  X
                </button>
                <div className='popup-line-input-container'>
                  <label>Sort by</label>
                </div>
                <div className='dropdown'>
                  <div className='popup-outline-input-container'>
                    <select id='select-sort-by'>
                      {sortOptions.map(option => {
                        if (option === sortBy) { // set current selection as default
                          return <option key={option} selected>{option}</option>;
                        } else {
                          return <option key={option}>{option}</option>;
                        }
                      })}
                    </select>
                  </div>
                </div>
                <div className='popup-line-input-container'>
                  <label>Sort direction</label>
                </div>
                <div className='dropdown'>
                  <div className='popup-outline-input-container'>
                    <select id='select-sort-dir'>
                      {dirOptions.map(dir => {
                        if (dir === order) { // set current direction as default
                          return <option key={dir} selected>{dir}</option>;
                        } else {
                          return <option key={dir}>{dir}</option>;
                        }
                      })}
                    </select>
                  </div>
                </div>
                <button type='button' id='confirm-btn-popup' className='primary-btn' 
                  onClick={() =>  {
                    updateSort();
                    close();
                  }}>
                  SHOW RECIPES
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </>
  );
};


SortingPopup.propTypes = {
  sortBy: PropTypes.string,
  setSortBy: PropTypes.func,
  order: PropTypes.string,
  setOrder: PropTypes.func
};

export default SortingPopup;