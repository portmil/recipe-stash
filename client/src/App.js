import './styles/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/userManagement/PrivateRoute';
import LandingPage from './components/LandingPage';
import LoginPage from './components/userManagement/LoginPage';
import SignupPage from './components/userManagement/SignupPage';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import AddRecipePage from './components/AddRecipePage';
import EditRecipePage from './components/EditRecipePage';
import RankingPage from './components/RankingPage';
import ProfilePage from './components/ProfilePage';
import NavigationLayout from './components/NavigationLayout';
import RecipePage from './components/RecipePage';
import SearchRoute from './context/SearchRoute';
import React from 'react';

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
          <Route element={<NavigationLayout/>}>
            <Route path='/home' element={<HomePage/>}/>
            <Route path='/add-recipe' element={<AddRecipePage/>}/>
            <Route path='/ranking' element={<RankingPage/>}/>
            <Route path='/profile' element={<ProfilePage/>}/>
            <Route element={<SearchRoute/>}> {/* keep search result in context when recipe page is visited */}
              <Route path='/search' element={<SearchPage/>}/>
              <Route path='/recipe/:id' element={<RecipePage/>}/>
            </Route>
            <Route path='/recipe/:id/edit' element={<EditRecipePage/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
