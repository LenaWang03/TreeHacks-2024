import "./ChatInput.css";
import { FaArrowRight, FaMicrophone, FaSearch } from "react-icons/fa";

export default function ChatInput() {
  return (
    <div className="searchCenter">
      <div className="input-container">
        <FaSearch />
        <input placeholder="Type your search here"></input>
        <FaMicrophone />
      </div>
      <button className="enterButton">Submit</button>
    </div>
  );
}
