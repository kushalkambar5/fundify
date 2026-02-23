import React, { useState, useRef, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { askChatbot } from "../services/modelServices";
import { CircleUserRound } from "lucide-react";
import chatbot from "../assets/chatbot.png";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your Fundify AI Assistant. I can help you analyze your spending habits, track your net worth growth, or provide insights into your investment portfolio. What would you like to explore today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (text) => {
    if (!text) return "";
    let formatted = text.replace(/\[CHUNK \d+\]/g, "");
    formatted = formatted.replace(/\[\s*\]/g, "");
    formatted = formatted.replace(
      /\[(?:SOURCE|CONTEXT|REF|DOC|RETRIEVED)[^\]]*\]/gi,
      "",
    );
    formatted = formatted.replace(
      /(\*?\*?)(Based on |From |Using |Referring to )?(the )?(previous |prior |earlier |past )?(context|conversation|history|chat)(:|\.)?(\*?\*?)\s*/gi,
      "",
    );
    formatted = formatted.replace(/\*?\*?Previous Context:?\*?\*?\s*/gi, "");
    // Bold
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    // Italic
    formatted = formatted.replace(/\*(.+?)\*/g, "<em>$1</em>");
    // Line breaks
    formatted = formatted.replace(/\n/g, "<br/>");
    // Lists
    formatted = formatted.replace(
      /^- (.+)/gm,
      '<span class="flex items-start gap-2 mt-1"><span class="text-emerald-500 mt-0.5">&bull;</span><span>$1</span></span>',
    );
    return formatted;
  };

  const handleSend = async () => {
    const query = input.trim();
    if (!query || isLoading) return;

    const userMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await askChatbot(query);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.answer || "I couldn't generate a response. Please try again.",
        },
      ]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error processing your request. Please try again in a moment.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your Fundify AI Assistant. I can help you analyze your spending habits, track your net worth growth, or provide insights into your investment portfolio. What would you like to explore today?",
      },
    ]);
  };

  const quickActions = [
    { label: "Check Credit Score", icon: "verified" },
    { label: "Investment Advice", icon: "trending_up" },
    { label: "Expense Analysis", icon: "receipt_long" },
    { label: "Net Worth Summary", icon: "account_balance" },
  ];

  const handleQuickAction = (action) => {
    setInput(action);
    setTimeout(() => {
      handleSend();
    }, 50);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f7faf8] font-display text-slate-900">
      <DashboardNavbar />

      <main className="flex flex-1 flex-col max-w-4xl mx-auto w-full px-4 md:px-6">
        {/* Title */}
        <div className="pt-8 pb-5 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2 justify-center">
            <img
              src={chatbot}
              alt="Fundify AI Assistant"
              className="w-12 h-12"
            />
            Fundify AI Assistant
          </h1>
        </div>

        {/* Quick Action Chips */}
        <div className="flex flex-wrap justify-center gap-2.5 pb-6">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.label)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-base text-emerald-500">
                {action.icon}
              </span>
              {action.label}
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto pb-4 space-y-6 chat-scroll">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} chat-message-animate`}
            >
              {/* AI Avatar */}
              {msg.role === "assistant" && (
                <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center mr-3 mt-1 shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-white text-base">
                    smart_toy
                  </span>
                </div>
              )}

              <div className="max-w-[75%] flex flex-col">
                {/* Sender Label */}
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                    msg.role === "user"
                      ? "text-slate-400 text-right"
                      : "text-emerald-600"
                  }`}
                >
                  {msg.role === "user" ? "You" : "Fundify AI"}
                </span>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-emerald-100 text-slate-800 rounded-br-md"
                      : msg.isError
                        ? "bg-red-50 text-red-700 border border-red-100 rounded-bl-md"
                        : "bg-emerald-50/80 text-slate-700 border border-emerald-100 rounded-bl-md"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(msg.content),
                  }}
                />
              </div>

              {/* User Avatar */}
              {msg.role === "user" && (
                <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center ml-3 mt-6 shrink-0 shadow-sm">
                  <CircleUserRound
                    className="h-5 w-5 text-white"
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start chat-message-animate">
              <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center mr-3 mt-1 shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-white text-base">
                  smart_toy
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider mb-1.5 text-emerald-600">
                  Fundify AI
                </span>
                <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl rounded-bl-md px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className="typing-dot w-2 h-2 rounded-full bg-emerald-400"></div>
                    <div className="typing-dot w-2 h-2 rounded-full bg-emerald-400 delay-150"></div>
                    <div className="typing-dot w-2 h-2 rounded-full bg-emerald-400 delay-300"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-[#f7faf8] pt-3 pb-2">
          <div className="flex items-center gap-3 bg-white rounded-full border border-slate-200 shadow-sm px-4 py-1.5 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
            <button className="text-slate-400 hover:text-emerald-500 transition-colors shrink-0">
              <span className="material-symbols-outlined text-xl">
                attach_file
              </span>
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Fundify about your financial health..."
              rows={1}
              className="flex-1 resize-none bg-transparent py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              style={{ maxHeight: "80px" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 80) + "px";
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="h-10 w-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-all shadow-md shadow-emerald-200 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-emerald-500 shrink-0"
            >
              <span className="material-symbols-outlined text-lg">
                {isLoading ? "hourglass_top" : "send"}
              </span>
            </button>
          </div>
          <p className="text-[10px] text-emerald-600/70 text-center mt-2 font-medium">
            Fundify AI can provide financial insights but does not replace
            professional advice.
          </p>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between py-3 border-t border-emerald-100 mt-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              AI Engine Online
            </span>
          </div>
          <button
            onClick={handleClearHistory}
            className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear History
          </button>
        </div>
      </main>
    </div>
  );
}
