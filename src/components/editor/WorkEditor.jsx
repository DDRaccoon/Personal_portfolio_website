"use client";

import { useMemo, useState } from "react";

import { createWork, updateWork } from "../../lib/worksStore";
import { CATEGORY_IDS, DEFAULT_CATEGORY, WORK_CATEGORIES } from "../../constants/workCategories";

const BLOCK_TYPES = ["Text", "Image", "Gallery", "Video", "Meta", "Divider", "Spacer"];

function createBlock(type) {
  const id = `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  switch (type) {
    case "Text":
      return { id, type, content: "" };
    case "Image":
      return { id, type, src: "", alt: "", caption: "" };
    case "Gallery":
      return { id, type, images: [], columns: 3 };
    case "Video":
      return {
        id,
        type,
        src: "",
        poster: "",
        caption: "",
        autoplay: true,
        loop: true,
        muted: true,
      };
    case "Meta":
      return {
        id,
        type,
        role: "",
        engine: "",
        tools: [],
        responsibilities: [],
        links: [],
      };
    case "Divider":
      return { id, type };
    case "Spacer":
      return { id, type, height: 32 };
    default:
      return { id, type: "Text", content: "" };
  }
}

function normalizeInitialWork(initialWork, initialCategory) {
  if (!initialWork) {
    return {
      title_en: "",
      summary_en: "",
      cover: "",
      category: initialCategory,
      tags: [],
      year: new Date().getFullYear(),
      blocks: [],
    };
  }

  return {
    title_en: initialWork.title_en || "",
    summary_en: initialWork.summary_en || "",
    cover: initialWork.cover || "",
    category: initialWork.category || initialCategory,
    tags: initialWork.tags || [],
    year: initialWork.year || new Date().getFullYear(),
    blocks: initialWork.blocks || [],
  };
}

function moveItem(list, index, direction) {
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= list.length) return list;

  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function TextInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block space-y-2 text-sm text-white/80">
      <span>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#FF7A18]/70"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="block space-y-2 text-sm text-white/80">
      <span>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#FF7A18]/70"
      />
    </label>
  );
}

function BlockEditor({ block, onChange }) {
  if (block.type === "Text") {
    return (
      <TextArea
        label="Markdown"
        value={block.content || ""}
        onChange={(content) => onChange({ ...block, content })}
        placeholder="Write markdown content..."
        rows={6}
      />
    );
  }

  if (block.type === "Image") {
    return (
      <div className="space-y-3">
        <TextInput
          label="Image URL"
          value={block.src || ""}
          onChange={(src) => onChange({ ...block, src })}
          placeholder="/images/your-image.jpg"
        />
        <TextInput
          label="Alt text"
          value={block.alt || ""}
          onChange={(alt) => onChange({ ...block, alt })}
          placeholder="Image alt text"
        />
        <TextInput
          label="Caption"
          value={block.caption || ""}
          onChange={(caption) => onChange({ ...block, caption })}
          placeholder="Optional caption"
        />
      </div>
    );
  }

  if (block.type === "Gallery") {
    const imagesText = (block.images || []).join("\n");

    return (
      <div className="space-y-3">
        <TextArea
          label="Image URLs (one per line)"
          value={imagesText}
          onChange={(raw) => {
            const images = raw
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean);
            onChange({ ...block, images });
          }}
          placeholder="/images/shot-1.jpg"
          rows={5}
        />
        <label className="block space-y-2 text-sm text-white/80">
          <span>Columns</span>
          <select
            value={block.columns || 3}
            onChange={(e) => onChange({ ...block, columns: Number(e.target.value) })}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#FF7A18]/70"
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </label>
      </div>
    );
  }

  if (block.type === "Video") {
    return (
      <div className="space-y-3">
        <TextInput
          label="Video URL"
          value={block.src || ""}
          onChange={(src) => onChange({ ...block, src })}
          placeholder="/videos/demo.mp4"
        />
        <TextInput
          label="Poster URL"
          value={block.poster || ""}
          onChange={(poster) => onChange({ ...block, poster })}
          placeholder="/images/video-poster.jpg"
        />
        <TextInput
          label="Caption"
          value={block.caption || ""}
          onChange={(caption) => onChange({ ...block, caption })}
          placeholder="Optional caption"
        />
      </div>
    );
  }

  if (block.type === "Meta") {
    return (
      <div className="space-y-3">
        <TextInput
          label="Role"
          value={block.role || ""}
          onChange={(role) => onChange({ ...block, role })}
          placeholder="Lead Technical Artist"
        />
        <TextInput
          label="Engine"
          value={block.engine || ""}
          onChange={(engine) => onChange({ ...block, engine })}
          placeholder="Unreal Engine 5"
        />
        <TextArea
          label="Tools (one per line)"
          value={(block.tools || []).join("\n")}
          onChange={(raw) => onChange({
            ...block,
            tools: raw.split("\n").map((item) => item.trim()).filter(Boolean),
          })}
          placeholder="Houdini"
          rows={4}
        />
        <TextArea
          label="Responsibilities (one per line)"
          value={(block.responsibilities || []).join("\n")}
          onChange={(raw) => onChange({
            ...block,
            responsibilities: raw.split("\n").map((item) => item.trim()).filter(Boolean),
          })}
          placeholder="Built shader library"
          rows={4}
        />
        <TextArea
          label="Links (one per line, url|label)"
          value={(block.links || []).map((item) => `${item.url}|${item.label || ""}`).join("\n")}
          onChange={(raw) => {
            const links = raw
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
              .map((line) => {
                const [url, label] = line.split("|");
                return { url: (url || "").trim(), label: (label || "").trim() };
              })
              .filter((item) => item.url);

            onChange({ ...block, links });
          }}
          placeholder="https://example.com|Build breakdown"
          rows={4}
        />
      </div>
    );
  }

  if (block.type === "Spacer") {
    return (
      <label className="block space-y-2 text-sm text-white/80">
        <span>Height (px)</span>
        <input
          type="number"
          value={block.height || 32}
          min={8}
          max={240}
          onChange={(e) => onChange({ ...block, height: Number(e.target.value) || 32 })}
          className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#FF7A18]/70"
        />
      </label>
    );
  }

  return <p className="text-sm text-white/60">No config needed.</p>;
}

export default function WorkEditor({
  mode = "create",
  workId,
  initialWork,
  initialCategory = DEFAULT_CATEGORY,
  onSave,
  onCancel,
}) {
  const safeCategory = CATEGORY_IDS.includes(initialCategory) ? initialCategory : DEFAULT_CATEGORY;

  const [form, setForm] = useState(() => normalizeInitialWork(initialWork, safeCategory));
  const [tagInput, setTagInput] = useState("");

  const blocks = form.blocks || [];

  const canSave = useMemo(
    () => form.title_en.trim() && form.summary_en.trim() && form.cover.trim(),
    [form.title_en, form.summary_en, form.cover]
  );

  const updateBlock = (index, nextBlock) => {
    const next = [...blocks];
    next[index] = nextBlock;
    setForm((prev) => ({ ...prev, blocks: next }));
  };

  const removeBlock = (index) => {
    setForm((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index),
    }));
  };

  const moveBlock = (index, direction) => {
    setForm((prev) => ({
      ...prev,
      blocks: moveItem(prev.blocks, index, direction),
    }));
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    if (form.tags.includes(value)) {
      setTagInput("");
      return;
    }

    setForm((prev) => ({ ...prev, tags: [...prev.tags, value] }));
    setTagInput("");
  };

  const submit = () => {
    if (!canSave) return;

    const payload = {
      ...form,
      category: CATEGORY_IDS.includes(form.category) ? form.category : DEFAULT_CATEGORY,
      year: Number(form.year) || new Date().getFullYear(),
      blocks,
    };

    const saved = mode === "edit" ? updateWork(workId, payload) : createWork(payload);

    if (!saved) {
      window.alert("Failed to save work.");
      return;
    }

    onSave?.(saved);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-xl border border-white/10 bg-black/40 p-5">
        <h2 className="text-lg font-medium text-white">Basic Fields</h2>

        <TextInput
          label="Title (EN) *"
          value={form.title_en}
          onChange={(title_en) => setForm((prev) => ({ ...prev, title_en }))}
          placeholder="Work title"
        />

        <TextArea
          label="Summary (EN) *"
          value={form.summary_en}
          onChange={(summary_en) => setForm((prev) => ({ ...prev, summary_en }))}
          placeholder="1-2 sentence summary"
          rows={3}
        />

        <TextInput
          label="Cover URL *"
          value={form.cover}
          onChange={(cover) => setForm((prev) => ({ ...prev, cover }))}
          placeholder="/images/works/cover.jpg"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2 text-sm text-white/80">
            <span>Category</span>
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#FF7A18]/70"
            >
              {WORK_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2 text-sm text-white/80">
            <span>Year</span>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm((prev) => ({ ...prev, year: Number(e.target.value) || new Date().getFullYear() }))}
              className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#FF7A18]/70"
            />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-white/80">Tags</label>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, tags: prev.tags.filter((item) => item !== tag) }))}
                className="rounded-full border border-[#FF7A18]/30 bg-[#FF7A18]/10 px-3 py-1 text-xs text-[#FFB58C]"
              >
                {tag} ×
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#FF7A18]/70"
              placeholder="Add tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="rounded-md border border-[#FF7A18]/50 px-3 py-2 text-sm text-[#FFB58C]"
            >
              Add
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-white/10 bg-black/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-medium text-white">Blocks</h2>
          <div className="flex flex-wrap gap-2">
            {BLOCK_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, blocks: [...prev.blocks, createBlock(type)] }))}
                className="rounded-md border border-white/20 px-3 py-1 text-xs text-white/80 hover:border-[#FF7A18]/50"
              >
                Add {type}
              </button>
            ))}
          </div>
        </div>

        {blocks.length === 0 ? (
          <p className="rounded-md border border-dashed border-white/20 p-6 text-center text-sm text-white/60">
            Add block, edit content, reorder with up/down, then save.
          </p>
        ) : (
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <article key={block.id} className="space-y-3 rounded-lg border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[#FFB58C]">{block.type}</p>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => moveBlock(index, "up")}
                      className="rounded border border-white/20 px-2 py-1 text-white/70 disabled:opacity-30"
                      disabled={index === 0}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBlock(index, "down")}
                      className="rounded border border-white/20 px-2 py-1 text-white/70 disabled:opacity-30"
                      disabled={index === blocks.length - 1}
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBlock(index)}
                      className="rounded border border-red-400/40 px-2 py-1 text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <BlockEditor block={block} onChange={(nextBlock) => updateBlock(index, nextBlock)} />
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/80"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={!canSave}
          className="rounded-md border border-[#FF7A18]/60 bg-[#FF7A18]/15 px-4 py-2 text-sm text-[#FFB58C] disabled:opacity-50"
        >
          Save
        </button>
      </section>
    </div>
  );
}
