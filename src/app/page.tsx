"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { FiFileText, FiGlobe, FiSearch, FiMessageCircle, FiArrowRight, FiZap, FiLayers, FiClock } from "react-icons/fi";

const features = [
  {
    href: "/summarize",
    icon: FiFileText,
    title: "Document Summarizer",
    description: "Paste any long text, article, or document and get concise, intelligent summaries with key takeaways and bullet points.",
    color: "#0ea5e9",
    tag: "NLP",
  },
  {
    href: "/translate",
    icon: FiGlobe,
    title: "Smart Translator",
    description: "Translate text between 30+ languages with context-aware AI translation. Preserves tone, idioms, and technical terms.",
    color: "#22c55e",
    tag: "Translation",
  },
  {
    href: "/extract",
    icon: FiSearch,
    title: "Key Info Extractor",
    description: "Extract structured data from unstructured text — names, dates, emails, addresses, key facts, and custom entities.",
    color: "#f59e0b",
    tag: "Extraction",
  },
  {
    href: "/qa",
    icon: FiMessageCircle,
    title: "Document Q&A",
    description: "Paste a document and ask questions about it. AI reads the full context and gives precise answers with references.",
    color: "#ef4444",
    tag: "Reasoning",
  },
];

const stats = [
  { icon: FiClock, label: "Processing", value: "< 3s" },
  { icon: FiGlobe, label: "Languages", value: "30+" },
  { icon: FiLayers, label: "AI Model", value: "MiMo V2.5" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <section className="max-w-5xl mx-auto mb-16 pt-8">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 mb-6">
              <FiZap className="text-[var(--accent-secondary)]" />
              <span className="text-sm text-[var(--accent-secondary)] font-medium">
                Powered by Xiaomi MiMo V2.5
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Smart Document
              <br />
              <span className="gradient-text">Analysis with AI</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Transform how you work with documents. Summarize, translate, extract key information, and ask questions — all powered by Xiaomi MiMo V2.5 reasoning model.
            </p>
          </div>

          <div className="flex justify-center gap-8 mb-16">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card px-6 py-4 flex items-center gap-3">
                <stat.icon className="text-[var(--accent-secondary)] text-xl" />
                <div>
                  <p className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group glass-card p-8 transition-all duration-300 hover:translate-y-[-4px] no-underline block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${feature.color}20` }}>
                    <feature.icon className="text-2xl" style={{ color: feature.color }} />
                  </div>
                  <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">{feature.description}</p>
                <div className="flex items-center gap-2 text-[var(--accent-secondary)] text-sm font-medium group-hover:gap-3 transition-all">
                  <span>Try Now</span>
                  <FiArrowRight />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto mb-8">
          <div className="glass-card p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Built for Document Intelligence</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Leveraging Xiaomi MiMo V2.5 reasoning capabilities for deep document understanding.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {["Next.js 16", "TypeScript", "Tailwind CSS", "MiMo V2.5 API", "NLP Pipeline", "React 19"].map((tech) => (
                <span key={tech} className="px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
