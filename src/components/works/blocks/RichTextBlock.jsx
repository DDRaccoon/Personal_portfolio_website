"use client";

import ReactMarkdown from "react-markdown";

export default function RichTextBlock({ block }) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-6 text-3xl font-semibold text-white md:text-4xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-4 text-2xl font-semibold text-white md:text-3xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 text-xl font-semibold text-white md:text-2xl">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-white/80">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 space-y-2 text-white/75">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF7A18]">•</span>
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-[#FFB58C]">
              {children}
            </strong>
          ),
          code: ({ children }) => (
            <code className="rounded bg-white/10 px-2 py-1 text-sm text-[#FFB58C]">
              {children}
            </code>
          )
        }}
      >
        {block.content || ""}
      </ReactMarkdown>
    </div>
  );
}