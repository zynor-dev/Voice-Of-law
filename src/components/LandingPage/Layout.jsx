
import React, { useState } from 'react';  // <-- Yeh line add karein
import "../styles/Layout.css";


const Chatbots = () => {
  // Aapke custom details (aap ise modify kar sakte hain)
  const [knowledgeBase] = useState({
    namaste: "Namaste! Main aapki kaise madad kar sakta hoon?",
    "aap ka naam": "Mera naam Afensor Chatbot hai",
    services:
      "Hum yeh services offer karte hain:\n1. Legal Advice\n2. Document Review\n3. Case Analysis",
    contact:
      "Aap humse contact kar sakte hain:\nPhone: 0123-456789\nEmail: contact@afensor.com",
    default:
      "Maaf kijiye, main aapke sawaal ka jawab nahi de paya. Kya aap doosre shabdon mein puch sakte hain?",
  });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // User message add karein
    setMessages((prev) => [...prev, { text: input, isUser: true }]);

    // Bot response find karein
    const lowerInput = input.toLowerCase();
    let response = knowledgeBase.default;

    for (const key in knowledgeBase) {
      if (lowerInput.includes(key)) {
        response = knowledgeBase[key];
        break;
      }
    }
    // Bot response add karein
    setMessages((prev) => [...prev, { text: response, isUser: false }]);
    setInput("");
  };
  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Chatbot Here !😒😉</h3>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.isUser ? "user" : "bot"}`}>
            {msg.text.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ))}
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask any Question..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbots;
