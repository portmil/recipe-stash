import '../../styles/App.css';
import '../../styles/LoginSignupPage.css';
import userService from '../../services/user';
import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";

const SignupPage = () => {

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);

    const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const user = await userService.signup({
				name, email, password,
			});
			localStorage.setItem('user', JSON.stringify(user));
            navigate('/main', { replace: true });

		} catch (exception) {
			setShowError(true);
		}
	};

    return (
        <div className='App'>
            <h1 id='login-signup-header'>Sign up</h1>
            {showError && <p className='form-error'>Error: Sign up was not successful</p>}
            <form className='user-form' onSubmit={handleSubmit}>
            <div className='line-input-container'>
                        <input required type="text" name="name" placeholder=' ' id='name'
                            onChange={({ target }) => setName(target.value)}>
                        </input>
                        <label htmlFor='name'>Name</label>
                </div>
                <div className='line-input-container'>
                        <input required type="email" name="email" placeholder=' ' id='email'
                            onChange={({ target }) => setEmail(target.value)}>
                        </input>
                        <label htmlFor='email'>Email</label>
                </div>
                <div className='line-input-container'>
                        <input required type="password" name="password" placeholder=' ' id='password'
                            onChange={({ target }) => setPassword(target.value)}>
                        </input>
                        <label htmlFor='password'>Password</label>
                </div>
                <button type='submit' className='primary-btn'>SIGN UP</button>
            </form>
        </div>
    );
};

export default SignupPage;