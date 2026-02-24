'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function RichTextBlock({ block }) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl md:text-4xl font-bold text-text-strong mb-6">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl md:text-3xl font-bold text-text-strong mb-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl md:text-2xl font-bold text-text-strong mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-text leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="text-gray-300 space-y-2 mb-4">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="flex items-start">
              <span className="text-[#ff8c5a] mr-2 mt-1">•</span>
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="text-[#ff8c5a] font-semibold">
              {children}
            </strong>
          ),
          code: ({ children }) => (
            <code className="bg-[#333] text-[#00d4ff] px-2 py-1 rounded text-sm">
              {children}
            </code>
          )
        }}
      >
        {block.content}
      </ReactMarkdown>
    </div>
  );
}