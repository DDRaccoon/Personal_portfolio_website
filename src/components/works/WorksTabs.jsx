'use client';

import React from 'react';
import './WorksTabs.css';

const TABS = [
  { id: 'full-game', label: 'FULL GAME PROJECT EXPERIENCE' },
  { id: 'demos', label: 'GAME DEMOS' },
  { id: 'tools', label: 'TOOLS / FEATURES' },
  { id: 'shader', label: 'SHADER / VFX' },
];

export default function WorksTabs({ activeCategory, onCategoryChange }) {
  return (
    <div className="works-tabs" role="tablist" aria-label="Work categories">
      {/* Subtle grid lines behind tabs */}
      <div className="works-tabs__grid-bg" aria-hidden="true" />

      {TABS.map((tab, idx) => {
        const isActive = tab.id === activeCategory;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onCategoryChange(tab.id)}
            className={`works-tab ${isActive ? 'works-tab--active' : ''}`}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                const next = TABS[(idx + 1) % TABS.length];
                onCategoryChange(next.id);
              } else if (e.key === 'ArrowLeft') {
                const prev = TABS[(idx - 1 + TABS.length) % TABS.length];
                onCategoryChange(prev.id);
              }
            }}
          >
            {/* Angled separator on the left edge (skip first) */}
            {idx > 0 && <span className="works-tab__separator" aria-hidden="true" />}

            {/* Corner tick marks */}
            <span className="works-tab__corner works-tab__corner--tl" aria-hidden="true" />
            <span className="works-tab__corner works-tab__corner--tr" aria-hidden="true" />
            <span className="works-tab__corner works-tab__corner--bl" aria-hidden="true" />
            <span className="works-tab__corner works-tab__corner--br" aria-hidden="true" />

            {/* Bottom glow strip for active */}
            {isActive && <span className="works-tab__glow" aria-hidden="true" />}

            {/* Label */}
            <span className="works-tab__label">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
