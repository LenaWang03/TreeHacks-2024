import "../../index.css";
import DefaultPrompts from "../DefaultPrompts/DefaultPrompt/DefaultPrompts";
import logo from "../../imgs/logo.svg";
import { Link } from "react-router-dom";
export default function Chat() {
  return (
    <div>
      <div className="logoRight">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
        <div className="subheading">Polaris</div>
      </div>
      <div className="popular">
        <div
          className="subheading"
          style={{ fontSize: "30px", marginBottom: "50px" }}
        >
          <span className="underline">Popular Searches</span>
        </div>
        <div className="defaultPrompts">
          <DefaultPrompts />
        </div>
      </div>
    </div>
  );
}
