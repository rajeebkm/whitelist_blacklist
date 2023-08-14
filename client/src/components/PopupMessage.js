import React from "react";
import "../App.css"; // Import your CSS file

const PopupMessage = ({ message, onClose }) => {
  return (
    <div className="popup-container">
      <div className="popup">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PopupMessage;
