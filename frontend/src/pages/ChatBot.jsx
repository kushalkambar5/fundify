import React, { useState, useRef, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { askChatbot } from "../services/modelServices";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your **AI Financial Advisor**. I have access to your complete financial profile and can provide personalized advice.\n\nTry asking me things like:\n- *How can I improve my savings rate?*\n- *Am I on track for my retirement goal?*\n- *What's a good investment strategy for my risk profile?*",
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
    // Strip retrieval source citations like [CHUNK 1], [SOURCE], etc.
    let formatted = text.replace(/\[CHUNK \d+\]/g, "");
    // Strip any remaining bracketed metadata tags and empty brackets
    formatted = formatted.replace(/\[\s*\]/g, "");
    formatted = formatted.replace(
      /\[(?:SOURCE|CONTEXT|REF|DOC|RETRIEVED)[^\]]*\]/gi,
      "",
    );
    // Strip references to previous context / conversation history
    formatted = formatted.replace(
      /(\*?\*?)(Based on |From |Using |Referring to )?(the )?(previous |prior |earlier |past )?(context|conversation|history|chat)(:|\.)?\*?\*?\s*/gi,
      "",
    );
    formatted = formatted.replace(/\*?\*?Previous Context:?\*?\*?\s*/gi, "");
    // Bold
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    // Italic
    formatted = formatted.replace(/\*(.+?)\*/g, "<em>$1</em>");
    // Line breaks
    formatted = formatted.replace(/\n/g, "<br/>");
    // Lists (simple)
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

  return (
    <div className="flex min-h-screen flex-col bg-white font-display text-slate-900">
      <DashboardNavbar />

      <main className="flex flex-1 flex-col max-w-4xl mx-auto w-full px-4 md:px-6">
        {/* Header */}
        <div className="py-6 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center shadow-md shadow-emerald-200">
              <span className="material-symbols-outlined text-white text-xl">
                smart_toy
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                AI Financial Advisor
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Personalized advice powered by your financial profile
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-700">
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-6 space-y-5 chat-scroll">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} chat-message-animate`}
            >
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center mr-3 mt-1 shrink-0">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">
                    smart_toy
                  </span>
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-emerald-500 text-white rounded-br-md shadow-md shadow-emerald-200"
                    : msg.isError
                      ? "bg-red-50 text-red-700 border border-red-100 rounded-bl-md"
                      : "bg-slate-50 text-slate-800 border border-slate-100 rounded-bl-md"
                }`}
                dangerouslySetInnerHTML={{
                  __html: formatMessage(msg.content),
                }}
              />
              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center ml-3 mt-1 shrink-0">
                  <span className="material-symbols-outlined text-white text-sm">
                    person
                  </span>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start chat-message-animate">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center mr-3 mt-1 shrink-0">
                <span className="material-symbols-outlined text-emerald-600 text-sm">
                  smart_toy
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-md px-5 py-4">
                <div className="flex items-center gap-1.5">
                  <div className="typing-dot w-2 h-2 rounded-full bg-emerald-400"></div>
                  <div className="typing-dot w-2 h-2 rounded-full bg-emerald-400 delay-150"></div>
                  <div className="typing-dot w-2 h-2 rounded-full bg-emerald-400 delay-300"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="sticky bottom-0 bg-white border-t border-emerald-100 py-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your finances..."
                rows={1}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                style={{ maxHeight: "120px" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 120) + "px";
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="h-11 w-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-all shadow-md shadow-emerald-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500 shrink-0"
            >
              <span className="material-symbols-outlined text-lg">
                {isLoading ? "hourglass_top" : "send"}
              </span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            AI responses are based on your financial profile and regulatory
            knowledge. Not financial advice.
          </p>
        </div>
      </main>
    </div>
  );
}
