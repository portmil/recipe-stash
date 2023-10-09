import './styles/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/userManagement/PrivateRoute';
import LandingPage from './components/LandingPage';
import LoginPage from './components/userManagement/LoginPage';
import SignupPage from './components/userManagement/SignupPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute type='visitors'/>}> {/* pages that are only visible to non logged users */}
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/signup' element={<SignupPage/>}/>
        </Route>
        <Route element={<PrivateRoute type='users'/>}> {/* pages that are only visible to logged users */}

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
