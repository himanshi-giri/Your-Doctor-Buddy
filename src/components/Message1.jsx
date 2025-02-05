import React from "react";
import "../styles/Message.css";
import icon from "../assets/images.png";


const Message = ({ role, content }) => {
  return (
    <div className={`message-container ${role === "user" ? "user" : "bot"}`}>
      {role === "assistant" &&(
       <img src={icon} alt="+" className="chatbot-response-icon" style={{ color: "#ADD8E6.", /* Green color to represent healthcare */ fontSize: "24px", marginRight: "10px", verticalAlign: "middle" }} />
      )}
      <div className="message-box">
      <p>{content}</p>
      </div>
    </div>
  );
};

export default Message;
