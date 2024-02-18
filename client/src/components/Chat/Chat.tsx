import "../../index.css";
import DefaultPrompts from "../DefaultPrompts/DefaultPrompt/DefaultPrompts";
import ChatInput from "../ChatInput/ChatInput";
import logo from "../../imgs/logo.svg";
import { Link } from "react-router-dom";
export default function Chat() {
  return (
    <div className="center">
      <div className="landing">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
          <div className="subheading">gaze.</div>
        </div>
        <div className="chatInput">
          <div className="subheading" style={{ color: "black" }}>
            What do you want to do?
          </div>
          <ChatInput />
        </div>
        <div className="defaultPrompts">
        <div className="subheading" style={{fontSize:"30px", marginBottom:"50px"}}>
            <span className="underline" >Popular Searches</span>
          </div>
          <DefaultPrompts />
        </div>
      </div>
    </div>
  );
}

{
  /* <DefaultPrompts /> */
}
