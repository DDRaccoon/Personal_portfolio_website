'use client';

import React, { useState } from 'react';
import { createWork } from '../../content/works';
import { SaveIcon, CloseIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon, DeleteIcon } from '../ui/icons';

// Block类型定义
const BLOCK_TYPES = [
  { type: 'RichText', label: 'Text', description: 'Rich text content with Markdown support' },
  { type: 'Image', label: 'Image', description: 'Single image with caption' },
  { type: 'Gallery', label: 'Gallery', description: 'Multiple images in a grid' },
  { type: 'Video', label: 'Video', description: 'Video player with controls' },
  { type: 'Meta', label: 'Project Info', description: 'Structured project information' },
  { type: 'Spacer', label: 'Spacer', description: 'Vertical spacing' },
  { type: 'Divider', label: 'Divider', description: 'Horizontal line separator' }
];

// 默认Block模板
const getDefaultBlock = (type) => {
  switch (type) {
    case 'RichText':
      return { type: 'RichText', id: `text-${Date.now()}`, content: '' };
    case 'Image':
      return { type: 'Image', id: `image-${Date.now()}`, src: '', alt: '', caption: '' };
    case 'Gallery':
      return { type: 'Gallery', id: `gallery-${Date.now()}`, images: [], columns: 3 };
    case 'Video':
      return { type: 'Video', id: `video-${Date.now()}`, src: '', poster: '', caption: '' };
    case 'Meta':
      return { 
        type: 'Meta', 
        id: `meta-${Date.now()}`, 
        role: '', 
        tools: [], 
        responsibilities: [],
        duration: '',
        teamSize: 1
      };
    case 'Spacer':
      return { type: 'Spacer', id: `spacer-${Date.now()}`, height: 32 };
    case 'Divider':
      return { type: 'Divider', id: `divider-${Date.now()}` };
    default:
      return { type: 'RichText', id: `text-${Date.now()}`, content: '' };
  }
};

export default function Editor({ initialCategory = 'full-game', onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title_en: '',
    summary_en: '',
    category: initialCategory,
    cover: '',
    tags: [],
    year: new Date().getFullYear()
  });
  
  const [blocks, setBlocks] = useState([]);
  const [currentTag, setCurrentTag] = useState('');

  // 添加新Block
  const addBlock = (type) => {
    const newBlock = getDefaultBlock(type);
    setBlocks([...blocks, newBlock]);
  };

  // 更新Block
  const updateBlock = (index, updates) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    setBlocks(newBlocks);
  };

  // 删除Block
  const deleteBlock = (index) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
  };

  // 移动Block
  const moveBlock = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) {
      return;
    }
    
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  // 添加标签
  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()]
      });
      setCurrentTag('');
    }
  };

  // 删除标签
  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // 保存作品
  const handleSave = () => {
    if (!formData.title_en.trim() || !formData.summary_en.trim()) {
      alert('Please fill in title and summary');
      return;
    }

    const workData = {
      ...formData,
      slug: formData.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      blocks: blocks
    };

    const result = createWork(workData);
    if (result) {
      onSave(result);
    } else {
      alert('Failed to save work');
    }
  };

  // Block渲染器
  const renderBlock = (block, index) => {
    const isFirst = index === 0;
    const isLast = index === blocks.length - 1;

    return (
      <div key={block.id} className="bg-bg-1 rounded-card border border-border p-4 mb-4">
        {/* Block头部 - 类型标签和操作按钮 */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-accent-orange bg-accent-orange/10 px-2 py-1 rounded">
            {block.type}
          </span>
          
          <div className="flex items-center space-1">
            <button 
              onClick={() => moveBlock(index, 'up')}
              disabled={isFirst}
              className="p-1 text-text-muted hover:text-text-strong disabled:opacity-30"
            >
              <ArrowUpIcon size={16} />
            </button>
            
            <button 
              onClick={() => moveBlock(index, 'down')}
              disabled={isLast}
              className="p-1 text-text-muted hover:text-text-strong disabled:opacity-30"
            >
              <ArrowDownIcon size={16} />
            </button>
            
            <button 
              onClick={() => deleteBlock(index)}
              className="p-1 text-text-muted hover:text-red-500"
            >
              <DeleteIcon size={16} />
            </button>
          </div>
        </div>

        {/* Block内容 */}
        <div className="space-3">
          {block.type === 'RichText' && (
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(index, { content: e.target.value })}
              placeholder="Enter your text content (Markdown supported)..."
              className="w-full h-32 p-3 bg-bg-0 border border-border rounded text-text-strong resize-vertical"
            />
          )}
          
          {block.type === 'Image' && (
            <div className="space-3">
              <input
                type="text"
                value={block.src}
                onChange={(e) => updateBlock(index, { src: e.target.value })}
                placeholder="Image URL"
                className="w-full p-2 bg-bg-0 border border-border rounded text-text-strong"
              />
              <input
                type="text"
                value={block.alt}
                onChange={(e) => updateBlock(index, { alt: e.target.value })}
                placeholder="Alt text"
                className="w-full p-2 bg-bg-0 border border-border rounded text-text-strong"
              />
              <input
                type="text"
                value={block.caption || ''}
                onChange={(e) => updateBlock(index, { caption: e.target.value })}
                placeholder="Caption (optional)"
                className="w-full p-2 bg-bg-0 border border-border rounded text-text-strong"
              />
            </div>
          )}
          
          {block.type === 'Spacer' && (
            <div className="flex items-center space-3">
              <span className="text-text-muted text-sm">Height:</span>
              <input
                type="number"
                value={block.height}
                onChange={(e) => updateBlock(index, { height: parseInt(e.target.value) || 32 })}
                className="w-20 p-2 bg-bg-0 border border-border rounded text-text-strong"
                min="8"
                max="200"
              />
              <span className="text-text-muted text-sm">px</span>
            </div>
          )}
          
          {/* 其他Block类型的实现... */}
        </div>
      </div>
    );
  };

  return (
    <div className="space-6">
      {/* 基础信息表单 */}
      <div className="bg-bg-1 rounded-card border border-border p-6">
        <h2 className="text-xl font-semibold text-text-strong mb-4">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">
              Title (English)
            </label>
            <input
              type="text"
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              className="w-full p-3 bg-bg-0 border border-border rounded text-text-strong"
              placeholder="Enter project title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 bg-bg-0 border border-border rounded text-text-strong"
            >
              <option value="full-game">Full Game Project Experience</option>
              <option value="demos">Game Demos</option>
              <option value="tools">Tools / Features</option>
              <option value="shader">Shader / VFX</option>
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-muted mb-2">
            Summary (English)
          </label>
          <textarea
            value={formData.summary_en}
            onChange={(e) => setFormData({ ...formData, summary_en: e.target.value })}
            className="w-full h-20 p-3 bg-bg-0 border border-border rounded text-text-strong resize-vertical"
            placeholder="Brief project description"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-muted mb-2">
            Cover Image URL
          </label>
          <input
            type="text"
            value={formData.cover}
            onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
            className="w-full p-3 bg-bg-0 border border-border rounded text-text-strong"
            placeholder="https://example.com/cover.jpg"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-muted mb-2">
            Year
          </label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
            className="w-32 p-3 bg-bg-0 border border-border rounded text-text-strong"
            min="2000"
            max="2030"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center bg-accent-orange/10 text-accent-orange px-3 py-1 rounded-full text-sm">
                {tag}
                <button 
                  onClick={() => removeTag(tag)}
                  className="ml-2 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1 p-3 bg-bg-0 border border-border rounded text-text-strong"
              placeholder="Add a tag"
            />
            <button 
              onClick={addTag}
              className="px-4 py-3 bg-accent-orange text-text-strong rounded hover:bg-accent-orange/90"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* 内容Blocks */}
      <div className="bg-bg-1 rounded-card border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-strong">Content Blocks</h2>
          
          {/* Block添加菜单 */}
          <div className="relative group">
            <button className="flex items-center space-2 px-4 py-2 bg-accent-orange text-text-strong rounded hover:bg-accent-orange/90">
              <PlusIcon size={16} />
              <span>Add Block</span>
            </button>
            
            <div className="absolute right-0 top-full mt-2 w-64 bg-bg-0 border border-border rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {BLOCK_TYPES.map((blockType) => (
                <button
                  key={blockType.type}
                  onClick={() => addBlock(blockType.type)}
                  className="w-full p-3 text-left hover:bg-bg-1 border-b border-border last:border-b-0"
                >
                  <div className="font-medium text-text-strong">{blockType.label}</div>
                  <div className="text-xs text-text-muted">{blockType.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blocks列表 */}
        <div>
          {blocks.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <p>No content blocks added yet.</p>
              <p className="text-sm">Click "Add Block" to start building your content.</p>
            </div>
          ) : (
            blocks.map((block, index) => renderBlock(block, index))
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end space-4">
        <button 
          onClick={onCancel}
          className="px-6 py-3 border border-border text-text-strong rounded hover:bg-bg-1"
        >
          <CloseIcon size={16} className="inline mr-2" />
          Cancel
        </button>
        
        <button 
          onClick={handleSave}
          className="px-6 py-3 bg-accent-orange text-text-strong rounded hover:bg-accent-orange/90"
        >
          <SaveIcon size={16} className="inline mr-2" />
          Save Work
        </button>
      </div>
    </div>
  );
}