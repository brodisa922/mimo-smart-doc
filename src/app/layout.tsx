import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MiMo Smart Doc — AI Document Analyzer",
  description:
    "AI-powered document analyzer built with Xiaomi MiMo V2.5. Summarize, translate, extract key info, and ask questions about any document.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
