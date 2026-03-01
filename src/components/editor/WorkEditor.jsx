"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { createWork, updateWork, uploadImageFile } from "../../lib/worksStore";
import { CATEGORY_IDS, DEFAULT_CATEGORY, WORK_CATEGORIES } from "../../constants/workCategories";

// ── Constants ──

const BLOCK_TYPES = [
  { type: "Title", label: "Title", icon: "T" },
  { type: "Description", label: "Description", icon: "D" },
  { type: "Text", label: "Text", icon: "Aa" },
  { type: "Image", label: "Image", icon: "🖼" },
  { type: "Video", label: "Video", icon: "▶" },
];

const AUTOSAVE_MS = 3000;
const MAX_VERSIONS = 20;
const VERSIONS_PREFIX = "work-versions-";

// ── Helpers ──

function uid() {
  return `b-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function createBlock(type) {
  const id = uid();
  switch (type) {
    case "Title":
      return { id, type, content: "", width: "full" };
    case "Description":
      return { id, type, content: "", width: "full" };
    case "Text":
      return { id, type, content: "", align: "left", width: "full" };
    case "Image":
      return { id, type, src: "", alt: "", caption: "", width: "full" };
    case "Video":
      return { id, type, src: "", poster: "", caption: "", width: "full" };
    default:
      return { id, type: "Text", content: "", width: "full" };
  }
}

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
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
      sort_order: 0,
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
    sort_order: initialWork.sort_order ?? 0,
    blocks: initialWork.blocks || [],
  };
}

// ── Version history helpers ──

function getVersions(workId) {
  if (typeof window === "undefined" || !workId) return [];
  try {
    const raw = localStorage.getItem(VERSIONS_PREFIX + workId);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function pushVersion(workId, form) {
  if (typeof window === "undefined" || !workId) return;
  try {
    const versions = getVersions(workId);
    versions.push({ ts: Date.now(), data: JSON.parse(JSON.stringify(form)) });
    if (versions.length > MAX_VERSIONS) versions.splice(0, versions.length - MAX_VERSIONS);
    localStorage.setItem(VERSIONS_PREFIX + workId, JSON.stringify(versions));
  } catch {}
}

// ── Inline inputs ──

function InlineInput({ value, onChange, placeholder, className = "" }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-transparent outline-none placeholder:text-white/25 ${className}`}
    />
  );
}

function InlineTextarea({ value, onChange, placeholder, className = "", minRows = 2 }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={minRows}
      className={`w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-white/25 ${className}`}
    />
  );
}

// ── Block width selector ──

function WidthSelector({ value, onChange }) {
  const options = [
    { key: "full", label: "100%" },
    { key: "half", label: "50%" },
    { key: "third", label: "33%" },
  ];

  return (
    <div className="flex gap-1">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onChange(option.key)}
          className={`rounded px-2 py-0.5 text-[10px] uppercase tracking-wider transition-colors ${
            value === option.key
              ? "bg-[#FF7A18]/20 text-[#FFB58C]"
              : "text-white/40 hover:text-white/60"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// ── Align selector (for Text blocks) ──

function AlignSelector({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {["left", "center", "right"].map((a) => (
        <button
          key={a}
          type="button"
          onClick={() => onChange(a)}
          className={`rounded px-1.5 py-0.5 text-[10px] transition-colors ${
            value === a
              ? "bg-[#FF7A18]/20 text-[#FFB58C]"
              : "text-white/40 hover:text-white/60"
          }`}
        >
          {a === "left" ? "◧" : a === "center" ? "◫" : "◨"}
        </button>
      ))}
    </div>
  );
}

// ── Drag handle icon ──

function DragHandle(props) {
  return (
    <span {...props} className="flex cursor-grab items-center text-white/30 hover:text-white/60">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="5" r="1.5" />
        <circle cx="15" cy="5" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="19" r="1.5" />
        <circle cx="15" cy="19" r="1.5" />
      </svg>
    </span>
  );
}

// ── Individual block renderers in editor ──

function TitleBlockEditor({ block, onChange }) {
  return (
    <InlineInput
      value={block.content || ""}
      onChange={(content) => onChange({ ...block, content })}
      placeholder="Enter title..."
      className="text-[28px] font-semibold leading-tight text-white"
    />
  );
}

function DescriptionBlockEditor({ block, onChange }) {
  return (
    <InlineTextarea
      value={block.content || ""}
      onChange={(content) => onChange({ ...block, content })}
      placeholder="Enter description..."
      className="text-[16px] leading-relaxed text-white/80"
      minRows={1}
    />
  );
}

function TextBlockEditor({ block, onChange }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end">
        <AlignSelector value={block.align || "left"} onChange={(align) => onChange({ ...block, align })} />
      </div>
      <InlineTextarea
        value={block.content || ""}
        onChange={(content) => onChange({ ...block, content })}
        placeholder="Write text content (supports Markdown)..."
        className={`text-[16px] leading-[1.5] text-white/80 ${
          block.align === "center" ? "text-center" : block.align === "right" ? "text-right" : "text-left"
        }`}
        minRows={3}
      />
    </div>
  );
}

function ImageBlockEditor({ block, onChange, workId }) {
  const fileRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      setUploadError("");
      const uploaded = await uploadImageFile(file, { workId });
      onChange({ ...block, src: uploaded.url, alt: block.alt || file.name });
    } catch (error) {
      setUploadError(error.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {block.src ? (
        <div className="group relative">
          <img
            src={block.src}
            alt={block.alt || ""}
            className="w-full rounded-lg border border-white/10 object-cover"
            style={{ maxHeight: 480 }}
          />
          <button
            type="button"
            onClick={() => onChange({ ...block, src: "" })}
            className="absolute right-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white/80 opacity-0 transition-opacity group-hover:opacity-100"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            if (!isUploading) {
              fileRef.current?.click();
            }
          }}
          className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-white/15 px-4 py-10 text-white/40 hover:border-[#FF7A18]/30 hover:text-white/60"
        >
          <span className="text-2xl">🖼</span>
          <span className="text-sm">{isUploading ? "Uploading to Supabase..." : "Click to upload image (PNG, JPG, GIF)"}</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        className="hidden"
        onChange={(e) => {
          void handleFile(e);
        }}
      />

      {uploadError && <p className="text-xs text-red-300/80">{uploadError}</p>}

      <InlineInput
        value={block.src?.startsWith("data:") ? "" : block.src || ""}
        onChange={(src) => onChange({ ...block, src })}
        placeholder="Or paste image URL..."
        className="text-sm text-white/60"
      />

      <InlineInput
        value={block.caption || ""}
        onChange={(caption) => onChange({ ...block, caption })}
        placeholder="Caption (optional)"
        className="text-[14px] text-white/50"
      />
    </div>
  );
}

function VideoBlockEditor({ block, onChange }) {
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange({ ...block, src: url });
  };

  const isEmbed = /youtube|youtu\.be|vimeo/.test(block.src || "");

  return (
    <div className="space-y-3">
      {block.src ? (
        <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-[#1a1a1a]">
          {isEmbed ? (
            <iframe
              src={block.src.replace("watch?v=", "embed/")}
              className="aspect-video w-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            <video
              src={block.src}
              poster={block.poster}
              controls
              playsInline
              className="w-full"
            />
          )}
          <button
            type="button"
            onClick={() => onChange({ ...block, src: "" })}
            className="absolute right-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white/80 opacity-0 transition-opacity group-hover:opacity-100"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-white/15 px-4 py-10 text-white/40 hover:border-[#FF7A18]/30 hover:text-white/60"
        >
          <span className="text-2xl">▶</span>
          <span className="text-sm">Click to upload video or paste URL below</span>
        </button>
      )}
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFile} />

      <InlineInput
        value={block.src?.startsWith("blob:") ? "" : block.src || ""}
        onChange={(src) => onChange({ ...block, src })}
        placeholder="Paste video URL (YouTube, Vimeo, or direct)..."
        className="text-sm text-white/60"
      />

      <InlineInput
        value={block.caption || ""}
        onChange={(caption) => onChange({ ...block, caption })}
        placeholder="Caption (optional)"
        className="text-[14px] text-white/50"
      />
    </div>
  );
}

// ── Block editor dispatcher ──

function BlockEditor({ block, onChange, workId }) {
  switch (block.type) {
    case "Title": return <TitleBlockEditor block={block} onChange={onChange} />;
    case "Description": return <DescriptionBlockEditor block={block} onChange={onChange} />;
    case "Text": return <TextBlockEditor block={block} onChange={onChange} />;
    case "Image": return <ImageBlockEditor block={block} onChange={onChange} workId={workId} />;
    case "Video": return <VideoBlockEditor block={block} onChange={onChange} />;
    default: return <p className="text-sm text-white/50">Unknown block type.</p>;
  }
}

// ── Add block picker ──

function AddBlockPicker({ onAdd }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded-lg border border-dashed border-white/15 py-3 text-sm text-white/40 transition-colors hover:border-[#FF7A18]/40 hover:text-[#FFB58C]"
      >
        + Add Block
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 flex flex-wrap gap-2 rounded-lg border border-white/15 bg-[#0A0A0A] p-3 shadow-xl">
          {BLOCK_TYPES.map((bt) => (
            <button
              key={bt.type}
              type="button"
              onClick={() => { onAdd(bt.type); setOpen(false); }}
              className="flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-white/80 transition-colors hover:border-[#FF7A18]/40 hover:bg-white/5"
            >
              <span className="text-base">{bt.icon}</span>
              <span>{bt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Version history panel ──

function VersionPanel({ workId, onRestore }) {
  const [open, setOpen] = useState(false);
  const versions = open ? getVersions(workId) : [];

  if (!workId) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-xs text-white/40 underline decoration-white/20 underline-offset-2 hover:text-white/60"
      >
        {open ? "Hide" : "Show"} version history
      </button>
      {open && (
        <div className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-lg border border-white/10 bg-black/30 p-3">
          {versions.length === 0 ? (
            <p className="text-xs text-white/40">No versions saved yet.</p>
          ) : (
            versions.slice().reverse().map((v, i) => (
              <div key={v.ts} className="flex items-center justify-between gap-2 text-xs">
                <span className="text-white/50">{new Date(v.ts).toLocaleString()}</span>
                <button
                  type="button"
                  onClick={() => { onRestore(v.data); setOpen(false); }}
                  className="rounded border border-white/15 px-2 py-0.5 text-[#FFB58C] hover:bg-white/5"
                >
                  Restore
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// ── Main WorkEditor component ──
// ════════════════════════════════════════

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
  const [autoSaveStatus, setAutoSaveStatus] = useState("");
  const dirtyRef = useRef(false);
  const timerRef = useRef(null);

  const blocks = form.blocks || [];
  const imageCoverOptions = useMemo(
    () => blocks
      .filter((block) => block.type === "Image" && block.src)
      .map((block, index) => ({
        id: block.id,
        src: block.src,
        label: block.caption || block.alt || `Image ${index + 1}`,
      })),
    [blocks]
  );

  const canSave = useMemo(
    () => form.title_en.trim() && form.summary_en.trim() && form.cover.trim(),
    [form.title_en, form.summary_en, form.cover]
  );

  // ── Auto-save ──

  const doAutoSave = useCallback(async () => {
    if (!canSave || mode !== "edit" || !workId) return;
    const payload = {
      ...form,
      category: CATEGORY_IDS.includes(form.category) ? form.category : DEFAULT_CATEGORY,
      year: Number(form.year) || new Date().getFullYear(),
    };
    const saved = await updateWork(workId, payload);
    if (saved) {
      pushVersion(workId, form);
      setAutoSaveStatus("Saved");
      dirtyRef.current = false;
      setTimeout(() => setAutoSaveStatus(""), 2000);
    }
  }, [canSave, mode, workId, form]);

  useEffect(() => {
    dirtyRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (dirtyRef.current) {
        void doAutoSave();
      }
    }, AUTOSAVE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [form, doAutoSave]);

  // ── Unsaved changes warning ──

  useEffect(() => {
    const handler = (e) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // ── Block CRUD ──

  const updateBlock = (index, nextBlock) => {
    const next = [...blocks];
    next[index] = nextBlock;
    setForm((prev) => ({ ...prev, blocks: next }));
  };

  const removeBlock = (index) => {
    setForm((prev) => ({ ...prev, blocks: prev.blocks.filter((_, i) => i !== index) }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = reorder(blocks, result.source.index, result.destination.index);
    setForm((prev) => ({ ...prev, blocks: reordered }));
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    if (form.tags.includes(value)) { setTagInput(""); return; }
    setForm((prev) => ({ ...prev, tags: [...prev.tags, value] }));
    setTagInput("");
  };

  const submit = async () => {
    if (!canSave) return;
    const payload = {
      ...form,
      category: CATEGORY_IDS.includes(form.category) ? form.category : DEFAULT_CATEGORY,
      year: Number(form.year) || new Date().getFullYear(),
      blocks,
    };
    const saved = mode === "edit"
      ? await updateWork(workId, payload)
      : await createWork(payload);
    if (!saved) { window.alert("Failed to save work."); return; }
    dirtyRef.current = false;
    if (mode === "edit" && workId) pushVersion(workId, form);
    onSave?.(saved);
  };

  const restoreVersion = (data) => {
    setForm(data);
  };

  // ── Width class map ──

  const widthClass = (w) => {
    if (w === "half") return "w-full md:w-[calc(50%-0.5rem)]";
    if (w === "third") return "w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]";
    return "w-full";
  };

  return (
    <div className="space-y-6">
      {/* ── Auto-save indicator ── */}
      {autoSaveStatus && (
        <div className="fixed right-6 top-6 z-50 rounded-md bg-green-500/15 px-3 py-1 text-xs text-green-300 backdrop-blur-sm">
          {autoSaveStatus}
        </div>
      )}

      {/* ── Basic Fields ── */}
      <section className="space-y-4 rounded-xl border border-white/10 bg-black/40 p-5">
        <h2 className="text-lg font-medium text-white">Project Info</h2>

        <label className="block space-y-1 text-sm text-white/80">
          <span>Title *</span>
          <input
            value={form.title_en}
            onChange={(e) => setForm((prev) => ({ ...prev, title_en: e.target.value }))}
            placeholder="Work title"
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#FF7A18]/70"
          />
        </label>

        <label className="block space-y-1 text-sm text-white/80">
          <span>Summary *</span>
          <textarea
            value={form.summary_en}
            onChange={(e) => setForm((prev) => ({ ...prev, summary_en: e.target.value }))}
            placeholder="1-2 sentence summary"
            rows={2}
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#FF7A18]/70"
          />
        </label>

        <label className="block space-y-1 text-sm text-white/80">
          <span>Cover URL *</span>
          <input
            value={form.cover}
            onChange={(e) => setForm((prev) => ({ ...prev, cover: e.target.value }))}
            placeholder="/images/works/cover.jpg"
            className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#FF7A18]/70"
          />
        </label>

        {imageCoverOptions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-white/55">Choose from images in content blocks</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {imageCoverOptions.map((option) => {
                const active = form.cover === option.src;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, cover: option.src }))}
                    className={`group overflow-hidden rounded-md border text-left transition-colors ${
                      active
                        ? "border-[#FF7A18]/70"
                        : "border-white/15 hover:border-[#FF7A18]/40"
                    }`}
                  >
                    <img src={option.src} alt={option.label} className="h-20 w-full object-cover" />
                    <p className="truncate px-2 py-1.5 text-xs text-white/70">{option.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <label className="block space-y-1 text-sm text-white/80">
            <span>Category</span>
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#FF7A18]/70"
            >
              {WORK_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm text-white/80">
            <span>Year</span>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm((prev) => ({ ...prev, year: Number(e.target.value) || new Date().getFullYear() }))}
              className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#FF7A18]/70"
            />
          </label>
          <label className="block space-y-1 text-sm text-white/80">
            <span>Sort Order</span>
            <input
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(e) => setForm((prev) => ({ ...prev, sort_order: Number(e.target.value) || 0 }))}
              className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#FF7A18]/70"
            />
            <p className="text-[11px] text-white/35">数字越小越靠前（0 = 第一位）</p>
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-white/80">Tags</label>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))}
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
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
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

      {/* ── Content Blocks with DnD ── */}
      <section className="space-y-4 rounded-xl border border-white/10 bg-black/40 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-white">Content Blocks</h2>
          <VersionPanel workId={workId} onRestore={restoreVersion} />
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="blocks">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-4"
                style={{ minHeight: 40 }}
              >
                {blocks.length === 0 && (
                  <p className="rounded-lg border border-dashed border-white/15 py-10 text-center text-sm text-white/40">
                    Click + Add Block below to start building your page.
                  </p>
                )}

                {blocks.map((block, index) => (
                  <Draggable key={block.id} draggableId={block.id} index={index}>
                    {(prov, snapshot) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        className={`group relative rounded-lg border transition-shadow ${widthClass(block.width)} ${
                          snapshot.isDragging
                            ? "border-[#FF7A18]/40 shadow-lg shadow-[#FF7A18]/10"
                            : "border-transparent hover:border-white/10"
                        }`}
                        style={{
                          ...prov.draggableProps.style,
                        }}
                      >
                        {/* ── Block toolbar (visible on hover) ── */}
                        <div className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-md border border-white/10 bg-[#0A0A0A] px-1.5 py-0.5 opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                          <DragHandle {...prov.dragHandleProps} />
                          <WidthSelector
                            value={block.width || "full"}
                            onChange={(width) => updateBlock(index, { ...block, width })}
                          />
                          <button
                            type="button"
                            onClick={() => removeBlock(index)}
                            className="ml-1 rounded px-1 py-0.5 text-[10px] text-red-400/70 hover:bg-red-400/10 hover:text-red-300"
                          >
                            ✕
                          </button>
                        </div>

                        {/* ── Block content ── */}
                        <div className="p-2.5">
                          <BlockEditor
                            block={block}
                            workId={workId}
                            onChange={(next) => updateBlock(index, next)}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <AddBlockPicker
          onAdd={(type) => setForm((prev) => ({ ...prev, blocks: [...prev.blocks, createBlock(type)] }))}
        />
      </section>

      {/* ── Actions ── */}
      <section className="flex items-center justify-between">
        <p className="text-xs text-white/30">
          {blocks.length} block{blocks.length !== 1 ? "s" : ""}
          {mode === "edit" && " · auto-saves every 3s"}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/80"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              void submit();
            }}
            disabled={!canSave}
            className="rounded-md border border-[#FF7A18]/60 bg-[#FF7A18]/15 px-5 py-2 text-sm font-medium text-[#FFB58C] disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </section>
    </div>
  );
}
