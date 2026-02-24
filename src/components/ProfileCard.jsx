'use client';

import React from 'react';
import Icon from './ui/Icon';

export default function ProfileCard() {
  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#1a1a1a]/80 to-[#2a2a2a]/60 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-[#333]/50 shadow-2xl">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* 头像区域 */}
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-[#ff8c5a]/30 shadow-lg">
            <img 
              src="/images/profile.jpg" 
              alt="SiCheng Chen"
              className="w-full h-full object-cover"
            />
            {/* 音乐律动圆环 */}
            <div className="absolute inset-0 rounded-full border-2 border-[#ff8c5a]/50 animate-pulse"></div>
          </div>
          
          <div className="mt-6 text-center">
            <h3 className="text-2xl font-bold text-white">SiCheng Chen</h3>
            <p className="text-[#00d4ff] mt-2">Technical Artist</p>
            
            {/* 社交图标 */}
            <div className="flex gap-4 mt-4 justify-center">
              <Icon size={24} className="text-[#ff8c5a] hover:text-[#ff6b35] transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </Icon>
              
              <Icon size={24} className="text-[#00d4ff] hover:text-[#00a8cc] transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </Icon>
            </div>
          </div>
        </div>
        
        {/* 个人信息 */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Hi, I'm <span className="text-[#ff8c5a]">SiCheng</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Technical Artist & Environment Artist with 5+ years of experience in game development. 
              Specialized in Unreal Engine 5, procedural workflows, and real-time rendering.
            </p>
          </div>
          
          {/* 技能标签 */}
          <div className="flex flex-wrap gap-2">
            {['Unreal Engine 5', 'Houdini', 'Substance', 'Python', 'GLSL', 'Blender'].map((skill) => (
              <span 
                key={skill}
                className="px-3 py-1 bg-[#ff8c5a]/10 border border-[#ff8c5a]/30 rounded-full text-sm text-[#ff8c5a]"
              >
                {skill}
              </span>
            ))}
          </div>
          
          {/* 联系按钮 */}
          <div className="flex gap-4 mt-6">
            <button className="px-6 py-3 bg-gradient-to-r from-[#ff8c5a] to-[#ff6b35] rounded-lg font-medium hover:shadow-lg transition-all">
              View Portfolio
            </button>
            <button className="px-6 py-3 border border-[#00d4ff] text-[#00d4ff] rounded-lg font-medium hover:bg-[#00d4ff]/10 transition-all">
              Contact Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}