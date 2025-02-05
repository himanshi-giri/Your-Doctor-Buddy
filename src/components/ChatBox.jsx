import React, { useState } from "react";
import Message from "./Message1";
import "../styles/ChatBox.css";
import chatbotlogo from "../assets/logo.jpg";
import { FaMicrophone } from "react-icons/fa";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false); // ✅ Fix: Added missing state

  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  
  // Function to Convert Text to Speech , for chatbot to speak
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";  // Language: English
    utterance.rate = 1;        // Speaking speed (1 is normal)
    utterance.pitch = 1;       // Pitch (1 is normal)
    speechSynthesis.speak(utterance);
  };
  //function to sennd message
  const sendMessage = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are an empathetic, helpful, and respectful senior general practitioner in this conversation.You will be talking to a user who is having some symptoms and wants clarity on what's happening and what they can do to improve their condition.Your primary function is to conduct virtual patient interviews, meticulously collecting health-related information to aid in forming a differential diagnosis, which will be reviewed by a senior doctor. Send messages one by one in a conversation format.Keep messages as well as the entire conversation crisp and short. Ask one follow up question at a particular time and Don’t send long questions to the user, keep questions simple,straightforward, and short.The goal of this conversation is to collect three things - Chief Complaint, Basic health information and related symptoms. Ensure to gather detailed descriptions by asking follow up questions from user of each related symptom , including onset, duration, triggers, and alleviation factors.Example follow up questions: question 1 : 'Could you describe your main health concern,?' question 2 :  ' When did it start, and how has it changed over time?' qestion 3: 'is there any other factors that worsen or improve it?' Please collect the duration and severity of the chief complaint. In basic health information, collect the age, name, gender, medical history. After finishing the symptom collection, provide diagnosis recommendation and possible care plan to the user. At the end of the conversation, summarize the conversation and create a symptom summary from the conversation and send it as part of the last message itself.The summary should highlight the key points just like how a General Practitioner would do. Along with that, breakdown her chief complaint, duration, severity, basic health information and related symptoms point by point , each new pont should start from a new line. Send the last message in an organized way and should be arranged in a manner that user can see each point clearly and efficiently.The context of this entire conversation should not be diverted to anything else apart from collecting all the symptoms. Politely refuse if the parent tries to ask any other questions.Do not collect any pictures or video, all inputs should be in text or voice/speech only." },
            ...messages,
            userMessage,
          ],
        }),
      });

      const data = await response.json();
      const botMessage = { role: "assistant", content: data.choices[0].message.content };
      //update chatbot response in ui
      setMessages((prev) => [...prev, botMessage]);

      //make chatbot speak the response 
      speakText(botMessage.content);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  // 🎤 Voice Recognition Function
  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.continuous = false; // Set to true if you want uninterrupted listening
    recognition.interimResults = false; // Set to true if you want real-time transcription
    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setInput(speechText);
      sendMessage(speechText); 
      setListening(false);// ✅ Fix: Now correctly sends recognized text
    };
    recognition.onspeechend = () => {
      // Automatically stop listening when user stops speaking
      recognition.stop();
      setListening(false);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => setListening(false);
  };

  return (
    
    <div className="chat-container">
      <div className="chatbot-icon-wrapper">
        <img src={chatbotlogo} alt="chatbot" className="chatbot-icon"/>
        <span className="title">DocBuddy</span>
      </div>
      

      <div className="chat-box">
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
        {loading && <div className="loading">Thinking...</div>}
        {listening && <div className="loading">Listening...</div>} {/* Show when listening */}
      </div>

      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask your medical question..."
        />
        <button onClick={() => sendMessage()}>Send</button>
        <button onClick={startListening} className={`mic-button ${listening ? "active" : ""}`}>
          <FaMicrophone />
        </button>
      </div>
    </div>

  );
};

export default ChatBox;
