'use client';

import React from 'react';

/**
 * 统一图标组件
 * 支持16/20/24三档尺寸，默认20px
 * 统一容器样式和strokeWidth
 */
const Icon = ({ 
  children, 
  size = 20, 
  className = '',
  strokeWidth = 1.5,
  ...props 
}) => {
  // 验证尺寸，只允许16/20/24
  const validSizes = [16, 20, 24];
  const iconSize = validSizes.includes(size) ? size : 20;
  
  return (
    <span 
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: iconSize, height: iconSize }}
      {...props}
    >
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child, { 
              width: iconSize, 
              height: iconSize,
              strokeWidth: strokeWidth
            })
          : child
      )}
    </span>
  );
};

export default Icon;