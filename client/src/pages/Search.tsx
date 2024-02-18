import "../index.css";
import ChatInput from "../components/ChatInput/ChatInput";
import logo from "../imgs/logo.svg";
import { FaTimesCircle } from "react-icons/fa";
import popup from "../imgs/popup.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Modal, Box } from "@mui/material";

export default function Search() {
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
      <div className="logoRight">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
        <div className="subheading">gaze.</div>
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
