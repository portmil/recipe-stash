import '../styles/App.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
		window.localStorage.removeItem('user');
		navigate(0, { replace: true });
	};

    return (
        <div>
            <h1>Home</h1>
            <button className="primary-btn" onClick={handleLogout}>LOGOUT</button>
        </div>
    );
};

export default HomePage;