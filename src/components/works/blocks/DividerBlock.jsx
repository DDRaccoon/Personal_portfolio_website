'use client';

import React from 'react';

export default function DividerBlock() {
  return (
    <div className="relative py-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#333]/50"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] px-4 text-gray-400 text-sm">
          •
        </span>
      </div>
    </div>
  );
}