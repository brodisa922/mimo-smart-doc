"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ReactMarkdown from "react-markdown";
import { FiMessageCircle, FiSend, FiTrash2, FiUpload } from "react-icons/fi";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function QAPage() {
  const [document, setDocument] = useState("");
  const [docLoaded, setDocLoaded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadDocument = () => {
    if (!document.trim()) return;
    setDocLoaded(true);
    setMessages([]);
  };

  const askQuestion = async () => {
    if (!input.trim() || loading || !docLoaded) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document,
          question: input.trim(),
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${error instanceof Error ? error.message : "Failed to answer."}` }]);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setDocument("");
    setDocLoaded(false);
    setMessages([]);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 flex flex-col h-screen">
        <div className="border-b border-[var(--border-color)] p-6 bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ef4444]/20 flex items-center justify-center">
              <FiMessageCircle className="text-[#ef4444] text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Document Q&A</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {docLoaded ? `Document loaded (${document.split(/\s+/).length} words) — Ask questions!` : "Load a document to start asking questions"}
              </p>
            </div>
          </div>
        </div>

        {!docLoaded ? (
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="max-w-2xl w-full glass-card p-8 animate-fade-in">
              <div className="text-center mb-6">
                <FiUpload className="text-4xl text-[var(--accent-secondary)] mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Load Your Document</h2>
                <p className="text-[var(--text-secondary)]">Paste your document below, then ask AI any questions about it.</p>
              </div>
              <textarea value={document} onChange={(e) => setDocument(e.target.value)} placeholder="Paste your document, article, report, contract, or any text here..." className="input-field min-h-[250px] mb-4" />
              <button onClick={loadDocument} disabled={!document.trim()} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                <FiUpload />
                <span>Load Document & Start Q&A</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="glass-card p-4 mb-4">
                <p className="text-xs text-[var(--text-secondary)]">
                  Document loaded: {document.substring(0, 150)}...
                </p>
              </div>

              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FiMessageCircle className="text-4xl text-[var(--text-secondary)] mb-4" />
                  <h2 className="text-xl font-bold mb-2">Ask a Question</h2>
                  <p className="text-[var(--text-secondary)] max-w-md mb-4">AI has read your document. Ask anything about its content.</p>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {["What is this document about?", "Summarize the key points", "What are the main conclusions?"].map((q) => (
                      <button key={q} onClick={() => setInput(q)} className="px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-all">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                  <div className={`max-w-[70%] px-5 py-4 rounded-2xl ${msg.role === "user" ? "bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] rounded-br-sm" : "bg-[var(--bg-card)] border border-[var(--border-color)] rounded-bl-sm"}`}>
                    <div className="prose prose-invert prose-sm max-w-none"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl rounded-bl-sm px-5 py-4">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-2 h-2 bg-[var(--accent-secondary)] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-[var(--border-color)] p-4 bg-[var(--bg-secondary)]">
              <div className="flex gap-3 max-w-4xl mx-auto">
                <button onClick={resetAll} className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--error)] transition-all" title="Load new document">
                  <FiTrash2 />
                </button>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && askQuestion()} placeholder="Ask a question about the document..." className="input-field flex-1" disabled={loading} />
                <button onClick={askQuestion} disabled={loading || !input.trim()} className="btn-primary px-6 flex items-center gap-2 disabled:opacity-50">
                  <FiSend /><span>Ask</span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
