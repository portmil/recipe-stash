import '../styles/App.css';
import '../styles/LandingPage.css';
import landingGraphic from '../graphics/landing_page_graphic.svg';
import { useNavigate } from "react-router-dom";

const introduction = "Sed do eiusmod tempor ut labore et dolore magna aliqua. Ut enim ad minim veniam."

const LandingPage = () => {

  const navigate = useNavigate();

  return (
    <div className="App">
      <div id="landing-background-orange">
        <h2 id="app-text">Recipe Stash</h2>
        <img id='landing-page-graphic' src={landingGraphic} alt='Cooking Pot'/>
        <svg id="landing-ellipse-mobile">
          <ellipse cx="50%" cy="570" rx="130%" ry="500"/>
        </svg>
        <svg id="landing-ellipse-desktop">
          <ellipse cx="50%" cy="600" rx="80%" ry="500"/>
        </svg>
        <svg id="landing-ellipse-desktop-large">
          <ellipse cx="50%" cy="600" rx="60%" ry="500"/>
        </svg>
        <div id="landing-content">
          <h1>Welcome</h1>
          <p>{introduction}</p>
          <div className="buttons">
            <button className="secondary-btn" onClick={()=>navigate("/login")}>LOGIN</button>
            <button className="primary-btn" onClick={()=>navigate("/signup")}>SIGN UP</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
