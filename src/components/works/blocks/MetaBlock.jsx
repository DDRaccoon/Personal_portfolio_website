'use client';

import React from 'react';
import Icon from '../../ui/Icon';

export default function MetaBlock({ block }) {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border border-[#333]/50 rounded-lg p-6 space-y-6">
      {/* 角色信息 */}
      <div>
        <h3 className="text-lg font-semibold text-[#ff8c5a] mb-2 flex items-center gap-2">
          <Icon size={20}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </Icon>
          角色
        </h3>
        <p className="text-gray-300">{block.role}</p>
      </div>

      {/* 工具和技术 */}
      <div>
        <h3 className="text-lg font-semibold text-[#00d4ff] mb-2 flex items-center gap-2">
          <Icon size={20}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z"/>
            </svg>
          </Icon>
          工具和技术
        </h3>
        <div className="flex flex-wrap gap-2">
          {block.tools.map((tool) => (
            <span key={tool} className="px-3 py-1 bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-full text-sm text-[#00d4ff]">
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* 职责 */}
      <div>
        <h3 className="text-lg font-semibold text-[#ff6b35] mb-2 flex items-center gap-2">
          <Icon size={20}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </Icon>
          主要职责
        </h3>
        <ul className="space-y-2">
          {block.responsibilities.map((responsibility, index) => (
            <li key={index} className="text-gray-300 flex items-start">
              <span className="text-[#ff6b35] mr-2 mt-1">•</span>
              {responsibility}
            </li>
          ))}
        </ul>
      </div>

      {/* 项目信息 */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#333]/50">
        {block.duration && (
          <div>
            <span className="text-gray-400 text-sm">开发周期</span>
            <p className="text-gray-300">{block.duration}</p>
          </div>
        )}
        {block.teamSize && (
          <div>
            <span className="text-gray-400 text-sm">团队规模</span>
            <p className="text-gray-300">{block.teamSize}人</p>
          </div>
        )}
      </div>
    </div>
  );
}