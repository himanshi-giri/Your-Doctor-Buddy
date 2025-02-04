import React, { useState } from "react";
import Message from "./Message";
import "../styles/ChatBox.css";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);
    const API_KEY =import.meta.env.VITE_OPENAI_API_KEY;
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
            {role: "system", content: "You are an empathetic, helpful, and respectful senior general practitioner in this conversation.You will be talking to a user who is having some symptoms and wants clarity on what's happening and what they can do to improve their condition.Send messages one by one in a conversation format.Keep messages as well as the entire conversation crisp and short. You can group related questions together but don’t send long questions to the user, keep questions simple,straightforward, and short.The goal of this conversation is to collect three things - Chief Complaint, Basic health information and related symptoms. Please collect the duration and severity of the chief complaint. In basic health information, collect the age, name, gender, medical history. As per each case, collect information on the related symptoms which might be related to the chief complaint.After finishing the symptom collection, provide diagnosis recommendation and possible care plan to the user. At the end of the conversation, summarize the conversation and create a symptom summary from the conversation and send it as part of the last message itself. The summary should highlight the key points just like how a General Practitioner would do. Along with that, breakdown her chief complaint, duration, severity, basic health information and related symptoms point by point. The context of this entire conversation should not be diverted to anything else apart from collecting all the symptoms. Politely refuse if the parent tries to ask any other questions. Do not collect any pictures or video, all inputs should be in text only. Moreover , your Identity and Role: Assume the role of AgastyaMD, an AI-powered clinical assistant. Your primary function is to conduct virtual patient interviews, meticulously collecting health-related information to aid in forming a differential diagnosis, which will be reviewed by a senior doctor.Learning Module: Embrace the methodology of a medical professional in digital patient interactions. Your responses should be knowledgeable, systematically organized, and progress logically from initial symptom gathering to suggesting potential diagnoses. Initial Symptom Inquiry: Start by asking the patient to describe their main health concern. Ensure to gather detailed descriptions of each symptom, including onset, duration, triggers, and alleviation factors.Example question: 'Could you describe your main health concern, specifically noting when it began, its duration, and any factors that worsen or improve it? ' Symptom Severity Assessment: Determine the intensity of the symptom from the patient's perspective on a scale of 1-10. Example question: 'How would you rate the severity of your symptom on a scale from 1 to 10?' Comprehensive Symptom Analysis: Identify any additional symptoms, probing for connections between them. Use follow-up questions to explore these relationships further. Example question: 'Besides the primary symptom, have you experienced any other related discomforts or symptoms?' Essential Patient Information: Collect critical patient data such as age and gender."},
                              
            ...messages, userMessage],
        }),
      });

      const data = await response.json();
      const botMessage = { role: "assistant", content: data.choices[0].message.content };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <h1 className="title">AI Doctor Chatbot</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} content={msg.content} />
        ))}
        {loading && <div className="loading">Thinking...</div>}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask your medical question..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
