import '../../styles/Popup.css';
import Popup from 'reactjs-popup';

const RankingInfo = () => {
  return (
    <Popup trigger={
      <button className='info-icon-button'>
        <h2 className='info-icon'>i</h2>
      </button>
    }
    modal nested>
      { close => (
        <div className='content'>
          <div className='popup-container ranking'>
            <p className='ranking-info-text'>Begin ranking recipes by switching on edit mode.</p>
            <p className='ranking-info-text'>Then drag and drop recipes from the unranked column to the ranked column.</p>
            <button type='button' className='primary-btn' onClick={close}>
              BACK
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default RankingInfo;