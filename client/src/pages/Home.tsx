import "../index.css";
import logo from "../imgs/logo.svg";
import Card from "../components/Card/Card";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="center">
        <div className="landing">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
            <div className="subheading">gaze.</div>
          </div>
          <div className="bigText">
            Navigating the web made <span className="underline">easy.</span>
          </div>
          <div className="smallText">
            gaze is a web browser that is designed to be simple and easy to use.
            It is built with the user in mind.
          </div>
          <div className="ctaButton" style={{marginBottom:"70px"}}>
            <Link to="/home">
              <button>Get Started</button>
            </Link>
          </div>
        </div>

        <div className="steps">
          <div className="subwhite">It’s as simple as 1,2,3!</div>

          <div className="step">
            <Card
              number="1"
              title="Search"
              text="for the task you want to accomplish"
            />
            <Card
              number="2"
              title="Follow"
              text="the instructions on the screen"
            />
            <Card number="3" title="Achieve" text="your goals :)" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
