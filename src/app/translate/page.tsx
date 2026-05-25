"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ReactMarkdown from "react-markdown";
import { FiGlobe, FiRefreshCw, FiCopy, FiCheck } from "react-icons/fi";

const languages = [
  "Auto-detect", "English", "Chinese (Simplified)", "Chinese (Traditional)", "Japanese", "Korean",
  "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Arabic", "Hindi",
  "Indonesian", "Malay", "Thai", "Vietnamese", "Turkish", "Polish", "Dutch", "Swedish",
  "Czech", "Greek", "Hebrew", "Danish", "Finnish", "Norwegian", "Romanian", "Ukrainian",
];

export default function TranslatePage() {
  const [text, setText] = useState("");
  const [sourceLang, setSourceLang] = useState("Auto-detect");
  const [targetLang, setTargetLang] = useState("English");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setTranslation("");
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sourceLang, targetLang, preserveTone: true }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTranslation(data.translation);
    } catch (error) {
      setTranslation(`Error: ${error instanceof Error ? error.message : "Failed to translate."}`);
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    if (sourceLang !== "Auto-detect") {
      setSourceLang(targetLang);
      setTargetLang(sourceLang);
    }
  };

  const copy = () => { navigator.clipboard.writeText(translation); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#ec4899]/20 flex items-center justify-center">
              <FiGlobe className="text-[#ec4899] text-lg" />
            </div>
            <h1 className="text-2xl font-bold">Smart Translator</h1>
          </div>
          <p className="text-[var(--text-secondary)]">Context-aware AI translation that preserves tone, idioms, and technical terms across 30+ languages.</p>
        </div>

        {/* Language selector */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-[var(--text-secondary)] mb-1 block">From</label>
              <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="input-field">
                {languages.map((l) => <option key={`s-${l}`} value={l}>{l}</option>)}
              </select>
            </div>
            <button onClick={swapLanguages} className="mt-5 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-secondary)] transition-all hover:rotate-180 duration-300">
              <FiRefreshCw />
            </button>
            <div className="flex-1">
              <label className="text-sm text-[var(--text-secondary)] mb-1 block">To</label>
              <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="input-field">
                {languages.filter((l) => l !== "Auto-detect").map((l) => <option key={`t-${l}`} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Original Text</h2>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste text to translate..." className="input-field min-h-[350px] mb-4" />
            <button onClick={handleTranslate} disabled={loading || !text.trim()} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Translating...</span></>) : (<><FiGlobe /><span>Translate</span></>)}
            </button>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Translation</h2>
              {translation && (
                <button onClick={copy} className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                  {copied ? <FiCheck className="text-[var(--success)]" /> : <FiCopy />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              )}
            </div>
            <div className="min-h-[400px] overflow-y-auto">
              {translation ? (
                <div className="prose prose-invert prose-sm max-w-none animate-fade-in"><ReactMarkdown>{translation}</ReactMarkdown></div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <FiGlobe className="text-4xl text-[var(--text-secondary)] mb-4" />
                  <p className="text-[var(--text-secondary)]">Enter text and click &quot;Translate&quot; to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
