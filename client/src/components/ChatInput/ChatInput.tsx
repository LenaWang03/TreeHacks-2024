import "./ChatInput.css";
import { FaSearch } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

export default function ChatInput() {
  return (
    <div className="input-container">
      <FaSearch />
      <input placeholder="Type your search here"></input>
      <button className="enterButton">
        <FaArrowRight />
      </button>
    </div>
  );
}
