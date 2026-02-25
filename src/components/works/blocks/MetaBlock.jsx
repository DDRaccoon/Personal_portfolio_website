"use client";

export default function MetaBlock({ block }) {
  const tools = Array.isArray(block.tools) ? block.tools : [];
  const responsibilities = Array.isArray(block.responsibilities) ? block.responsibilities : [];
  const links = Array.isArray(block.links) ? block.links : [];

  return (
    <div className="space-y-5 rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#FF7A18]/70">Role</p>
          <p className="text-sm text-white/85">{block.role || "-"}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#FF7A18]/70">Engine</p>
          <p className="text-sm text-white/85">{block.engine || "-"}</p>
        </div>
      </div>

      {tools.length > 0 && (
        <div>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-[#FF7A18]/70">Tools</p>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <span key={tool} className="rounded-full border border-[#FF7A18]/30 bg-[#FF7A18]/8 px-3 py-1 text-xs tracking-wide text-[#FFB58C]">
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {responsibilities.length > 0 && (
        <div>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-[#FF7A18]/70">Responsibilities</p>
          <ul className="space-y-2 text-sm leading-relaxed text-white/75">
            {responsibilities.map((responsibility, index) => (
              <li key={`${responsibility}-${index}`} className="flex items-start">
                <span className="mr-2.5 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#FF7A18]/60" />
                {responsibility}
              </li>
            ))}
          </ul>
        </div>
      )}

      {links.length > 0 && (
        <div>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-[#FF7A18]/70">Links</p>
          <div className="space-y-1.5">
            {links.map((item, index) => (
              <a
                key={`${item.url}-${index}`}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[#FFB58C] underline decoration-[#FF7A18]/40 underline-offset-2 transition-colors hover:text-[#FF7A18]"
              >
                {item.label || item.url}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}