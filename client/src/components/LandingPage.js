import '../styles/App.css';
import '../styles/LandingPage.css'

const introduction = "Sed do eiusmod tempor ut labore et dolore magna aliqua. Ut enim ad minim veniam."

const LandingPage = () => {
  return (
    <div className="App">
      <div className="landing">
        <div className="landing-background">
          <svg className="landing-ellipse">
            <ellipse cx="50%" cy="80vh" rx="130%" ry="500"/>
          </svg>
          <div className="landing-content">
            <h1>Welcome</h1>
            <p>{introduction}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
