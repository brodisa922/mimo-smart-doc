"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ReactMarkdown from "react-markdown";
import { FiFileText, FiZap, FiCopy, FiCheck } from "react-icons/fi";

const styles = ["Concise", "Detailed", "Executive Brief", "Academic", "Bullet Points"];
const lengths = ["Short (1-2 paragraphs)", "Medium (3-5 paragraphs)", "Long (comprehensive)"];

export default function SummarizePage() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState("Concise");
  const [length, setLength] = useState("Medium (3-5 paragraphs)");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setSummary("");
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, style, length }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSummary(data.summary);
    } catch (error) {
      setSummary(`Error: ${error instanceof Error ? error.message : "Failed to summarize. Check API configuration."}`);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => { navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#a855f7]/20 flex items-center justify-center">
              <FiFileText className="text-[#a855f7] text-lg" />
            </div>
            <h1 className="text-2xl font-bold">Document Summarizer</h1>
          </div>
          <p className="text-[var(--text-secondary)]">Paste any text and get an intelligent AI-powered summary with key takeaways.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Input Document</h2>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your document, article, or any text here..." className="input-field min-h-[300px] mb-4" />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-[var(--text-secondary)] mb-2 block">Summary Style</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)} className="input-field">
                  {styles.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-[var(--text-secondary)] mb-2 block">Length</label>
                <select value={length} onChange={(e) => setLength(e.target.value)} className="input-field">
                  {lengths.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleSummarize} disabled={loading || !text.trim()} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Summarizing...</span></>) : (<><FiZap /><span>Summarize</span></>)}
            </button>
            <p className="text-xs text-[var(--text-secondary)] mt-3 text-center">{text.length} characters · ~{Math.round(text.split(/\s+/).filter(Boolean).length)} words</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Summary</h2>
              {summary && (
                <button onClick={copy} className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                  {copied ? <FiCheck className="text-[var(--success)]" /> : <FiCopy />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              )}
            </div>
            <div className="min-h-[400px] overflow-y-auto">
              {summary ? (
                <div className="prose prose-invert prose-sm max-w-none animate-fade-in"><ReactMarkdown>{summary}</ReactMarkdown></div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <FiFileText className="text-4xl text-[var(--text-secondary)] mb-4" />
                  <p className="text-[var(--text-secondary)]">Paste your text and click &quot;Summarize&quot; to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
