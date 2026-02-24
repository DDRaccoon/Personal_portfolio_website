'use client';

import React from 'react';

export default function SpacerBlock({ block }) {
  return (
    <div style={{ height: `${block.height}px` }} />
  );
}