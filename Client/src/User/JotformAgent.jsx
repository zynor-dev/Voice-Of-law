// client/src/User/JotformAgent.jsx
import React, { useState, useRef, useEffect } from "react";
import { jotformAiAPI, handleApiError } from "../services/api"; // Path check kar lena apne mutabiq

const JotformAgent = () => {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Welcome to Voice of Law AI. Main aapke Jotform portal aur queries ke mutabiq aapki madad ke liye tayar hoon!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const response = await jotformAiAPI.chat(userText);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: response.data.reply },
      ]);
    } catch (error) {
      const errMsg = handleApiError(error);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: `Error: ${errMsg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-slate-900 text-white rounded-xl overflow-hidden border border-slate-800 shadow-xl">
      {/* Header */}
      <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></div>
          <h2 className="text-lg font-semibold tracking-wide text-indigo-400">
            Jotform AI Case Agent
          </h2>
        </div>
        <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-md">
          Zero Watermark Mode
        </span>
      </div>

      {/* Chat Space */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xl p-3.5 rounded-xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-none"
                  : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-3 rounded-xl rounded-tl-none flex space-x-1.5 items-center">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-slate-800/30 border-t border-slate-800">
        <form onSubmit={handleSend} className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question about forms or cases..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Ask Agent
          </button>
        </form>
      </div>
    </div>
  );
};

export default JotformAgent;
