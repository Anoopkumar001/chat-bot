import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const App = () => {
  const [question, setQuestion] = useState("");
  // const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const chatEndRef = useRef(null);


  //load messages

  const [messages, setMessages] = useState(() => {
  const saved = localStorage.getItem("messages");
  return saved ? JSON.parse(saved) : [];
});


// Save messages
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
  
   const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) return;

    const userQuestion = question;

    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://chatbot-backend-n39w.onrender.com/ask",
        {
          question: userQuestion,
        }
      );

      if (res.data._status) {
        setMessages((prev) => [
          ...prev,
          {
            question: userQuestion,
            answer: res.data.answer,
          },
        ]);
      }
    } catch (err) {
      console.log(err);

      setMessages((prev) => [
        ...prev,
        {
          question: userQuestion,
          answer: "Something went wrong!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const copyAnswer = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-300 ${darkMode
        ? "bg-slate-900 text-white"
        : "bg-gray-100 text-black"
        }`}
    >
      {/* Header */}

      <div
        className={`px-8 py-5 flex justify-between items-center shadow-lg ${darkMode
          ? "bg-slate-950 text-white"
          : "bg-white text-black"
          }`}
      >
        <h1 className="text-3xl font-bold">
          AI Chat Assistant
        </h1>

        <div className="flex gap-3">

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg cursor-pointer"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <button
            onClick={clearChat}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg cursor-pointer"
          >
            Clear Chat
          </button>

        </div>
      </div>

      {/* Chat Section */}

      <div
        className={`flex-1 overflow-y-auto p-6 space-y-6 transition-all duration-300 ${darkMode
          ? "bg-slate-900"
          : "bg-gray-100"
          }`}
      >
        {messages.length === 0 && !loading && (
          <div className="text-center text-slate-400 mt-20">
            <h2 className="text-3xl font-bold mb-3">
              Welcome 👋
            </h2>

            <p>Ask anything to start chatting.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className="space-y-4">

            {/* User Message */}

            <div className="flex justify-end">
              <div className="bg-blue-600 text-white p-4 rounded-2xl max-w-[70%] shadow-lg">
                <p>{msg.question}</p>
              </div>
            </div>

            {/* AI Message */}

            <div className="flex justify-start">
              <div
                className={`p-4 rounded-2xl max-w-[75%] shadow-lg ${darkMode
                  ? "bg-slate-800 text-white"
                  : "bg-white text-black"
                  }`}
              >

                <p className="whitespace-pre-wrap leading-7">
                  {msg.answer}
                </p>

                <button
                  onClick={() => copyAnswer(msg.answer)}
                  className={`mt-4 px-4 py-2 rounded-lg text-sm cursor-pointer ${darkMode
                    ? "bg-slate-700 hover:bg-slate-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-black"
                    }`}
                >
                  Copy
                </button>

              </div>
            </div>

          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className={`p-4 rounded-2xl animate-pulse ${darkMode
                ? "bg-slate-800 text-white"
                : "bg-white text-black"
                }`}
            >
              AI is thinking...
            </div>
          </div>
        )}

        <div ref={chatEndRef}></div>

      </div>

      {/* Input Area */}

      <form
        onSubmit={handleSubmit}
        className={`p-5 border-t flex gap-4 ${darkMode
          ? "bg-slate-950 border-slate-700"
          : "bg-white border-gray-300"
          }`}
      >
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything..."
          rows="2"
          className={`flex-1 rounded-xl p-4 outline-none resize-none ${darkMode
            ? "bg-slate-800 text-white"
            : "bg-gray-100 text-black border border-gray-300"
            }`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-semibold"
        >
          {loading ? "..." : "Send"}
        </button>

      </form>

    </div>
  );
};

export default App;

