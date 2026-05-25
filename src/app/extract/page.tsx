"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ReactMarkdown from "react-markdown";
import { FiSearch, FiZap, FiCopy, FiCheck } from "react-icons/fi";

const extractionTypes = [
  "Names & People", "Dates & Times", "Locations & Addresses", "Organizations & Companies",
  "Emails & Contacts", "Phone Numbers", "Key Facts & Claims", "Numbers & Statistics",
  "URLs & Links", "Technical Terms", "Action Items & Tasks", "Sentiment & Opinions",
];

export default function ExtractPage() {
  const [text, setText] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Names & People", "Dates & Times", "Key Facts & Claims"]);
  const [extracted, setExtracted] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleExtract = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setExtracted("");
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, extractTypes: selectedTypes }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setExtracted(data.extracted);
    } catch (error) {
      setExtracted(`Error: ${error instanceof Error ? error.message : "Failed to extract."}`);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => { navigator.clipboard.writeText(extracted); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/20 flex items-center justify-center">
              <FiSearch className="text-[#f59e0b] text-lg" />
            </div>
            <h1 className="text-2xl font-bold">Key Info Extractor</h1>
          </div>
          <p className="text-[var(--text-secondary)]">Extract structured data from unstructured text — names, dates, facts, contacts, and more.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Input Text</h2>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste any text — emails, articles, reports, contracts..." className="input-field min-h-[200px] mb-4" />

            <div className="mb-4">
              <label className="text-sm text-[var(--text-secondary)] mb-3 block">What to Extract</label>
              <div className="flex flex-wrap gap-2">
                {extractionTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedTypes.includes(type)
                        ? "bg-[var(--accent-primary)]/20 text-[var(--accent-secondary)] border border-[var(--accent-primary)]/40"
                        : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)]/30"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleExtract} disabled={loading || !text.trim() || selectedTypes.length === 0} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Extracting...</span></>) : (<><FiZap /><span>Extract Information</span></>)}
            </button>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Extracted Data</h2>
              {extracted && (
                <button onClick={copy} className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
                  {copied ? <FiCheck className="text-[var(--success)]" /> : <FiCopy />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              )}
            </div>
            <div className="min-h-[450px] overflow-y-auto">
              {extracted ? (
                <div className="prose prose-invert prose-sm max-w-none animate-fade-in"><ReactMarkdown>{extracted}</ReactMarkdown></div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[450px] text-center">
                  <FiSearch className="text-4xl text-[var(--text-secondary)] mb-4" />
                  <p className="text-[var(--text-secondary)]">Paste text and select what to extract</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
