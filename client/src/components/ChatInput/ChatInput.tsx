import "./ChatInput.css";
import { FaMicrophone, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { Modal, Box } from "@mui/material";
import { FaTimesCircle } from "react-icons/fa";
import popup from "../../imgs/popup.svg";

export default function ChatInput() {
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 620,
    height: 330,
    bgcolor: "white",
    borderRadius: "20px",
    p: 4,
    textAlign: "left", // Add this line for left justification
    alignItems: "flex-start", // Align items to the start (top) of the container
  };

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const handleExit = () => {
    setOpen(false);
  };

  return (
    <div>
      <Modal open={open}>
        <Box sx={modalStyle}>
          <div className="ex" onClick={() => handleExit()}>
            <FaTimesCircle />
          </div>
          <img style={{}} src={popup} alt="logo" />
          {open}
        </Box>
      </Modal>
      <div className="searchCenter">
        <div className="input-container">
          <FaSearch />
          <input
            placeholder="Type your search here"
            onChange={(e) => setText(e.currentTarget.value)}
          ></input>
          <FaMicrophone />
        </div>
        <button
          className="enterButton"
          onClick={() => {
            if (text === "I want to see my grandson's Facebook profile") {
              const url = `https://www.facebook.com?polarisEnabled=true`;
              window.open(url, "_blank");
            } else {
              setOpen(true);
            }
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
