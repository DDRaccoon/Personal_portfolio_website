"use client";

export default function MetaBlock({ block }) {
  const tools = Array.isArray(block.tools) ? block.tools : [];
  const responsibilities = Array.isArray(block.responsibilities) ? block.responsibilities : [];
  const links = Array.isArray(block.links) ? block.links : [];

  return (
    <div className="space-y-6 rounded-lg border border-white/10 bg-black/30 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/50">Role</p>
          <p className="mt-1 text-sm text-white/85">{block.role || "-"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-white/50">Engine</p>
          <p className="mt-1 text-sm text-white/85">{block.engine || "-"}</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-white/50">Tools</p>
        <div className="flex flex-wrap gap-2">
          {tools.map((tool) => (
            <span key={tool} className="rounded-full border border-[#FF7A18]/35 bg-[#FF7A18]/10 px-3 py-1 text-xs text-[#FFB58C]">
              {tool}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-white/50">Responsibilities</p>
        <ul className="space-y-2 text-sm text-white/80">
          {responsibilities.map((responsibility, index) => (
            <li key={`${responsibility}-${index}`} className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF7A18]">•</span>
              {responsibility}
            </li>
          ))}
        </ul>
      </div>

      {links.length > 0 && (
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-white/50">Links</p>
          <div className="space-y-1">
            {links.map((item, index) => (
              <a
                key={`${item.url}-${index}`}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="block text-sm text-[#FFB58C] underline decoration-[#FF7A18]/50 underline-offset-2"
              >
                {item.label || item.url}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}