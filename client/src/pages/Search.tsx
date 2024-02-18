import "../index.css";
import ChatInput from "../components/ChatInput/ChatInput";
import logo from "../imgs/logo.svg";
import { Link } from "react-router-dom";

export default function Search() {
  return (
    <div>
      <div className="logoRight">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
        <div className="subheading">polaris.</div>
      </div>
      <div className="center">
        <div className="search">
          <div className="chatInput">
            <div className="bigText" style={{ fontSize: "50px" }}>
              What would you like help with today?
            </div>
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
}

/*

      */
