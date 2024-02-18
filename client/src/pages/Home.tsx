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
            <div className="subheading">polaris.</div>
          </div>
          <div className="bigText" style={{textAlign:"center"}}>
          Reimagining an internet made for <span className="underline">everyone.</span>
          </div>
          <div className="smallText" style={{textAlign:"center"}}>
          Polaris is a digital companion designed for everyone. We use large language and multi-modal models to redefine web accessibility and make exploring the web as simple as putting what you want to do into words.
          </div>
          <div className="ctaButton" style={{ marginBottom: "70px" }}>
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
