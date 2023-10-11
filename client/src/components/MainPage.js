import '../styles/App.css';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
		window.localStorage.removeItem('user');
		navigate(0, { replace: true });
	};

    return (
        <div>
            <button className="primary-btn" onClick={handleLogout}>LOGOUT</button>
        </div>
    );
};

export default MainPage;