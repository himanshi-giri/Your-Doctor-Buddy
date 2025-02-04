import React from "react";
import "../styles/Message.css";
import { FaUserMd } from "react-icons/fa"; // Import doctor icon


const Message = ({ role, content }) => {
  return (
    <div className={`message-container ${role === "user" ? "user" : "bot"}`}>
      {role === "bot" &&(
        <div className="bot-icon">
           <FaUserMd size={24} color="#007bff" />
        </div>
      )}
      <div className="message-box">
      <p>{content}</p>
      </div>
    </div>
  );
};

export default Message;
