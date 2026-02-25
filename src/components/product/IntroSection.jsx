"use client";

import Icon from "../ui/Icon";
import { useSiteCopy } from "../i18n/LanguageProvider";

const SOCIAL_ICONS = {
  github: (
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.53.1.72-.23.72-.5v-1.96c-2.94.64-3.56-1.25-3.56-1.25-.48-1.22-1.17-1.55-1.17-1.55-.96-.65.07-.64.07-.64 1.06.08 1.62 1.1 1.62 1.1.94 1.62 2.47 1.15 3.07.88.1-.68.37-1.15.67-1.42-2.34-.27-4.8-1.17-4.8-5.2 0-1.15.41-2.08 1.08-2.82-.11-.26-.47-1.33.1-2.77 0 0 .89-.29 2.9 1.08a10.1 10.1 0 0 1 5.28 0c2.01-1.37 2.9-1.08 2.9-1.08.58 1.44.22 2.5.11 2.77.68.74 1.08 1.67 1.08 2.82 0 4.04-2.47 4.93-4.82 5.2.38.33.72.98.72 1.98v2.93c0 .28.19.61.73.5A10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  ),
  linkedin: (
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.75h3.96V21H3V9.75Zm6.21 0h3.8v1.54h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-3.96v-4.95c0-1.18-.02-2.7-1.64-2.7-1.64 0-1.9 1.28-1.9 2.62V21H9.2V9.75Z" />
    </svg>
  ),
};

export default function IntroSection() {
  const siteCopy = useSiteCopy();

  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="flex max-w-2xl flex-col items-center text-center">
        {/* Profile photo */}
        <div
          className="relative mb-8 overflow-hidden rounded-full border border-white/10"
          style={{ width: 256, height: 256 }}
        >
          <img
            src="/images/profile.jpg"
            alt={siteCopy.intro.name}
            className="h-full w-full object-cover"
            style={{ width: 256, height: 256 }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const svg = e.currentTarget.nextElementSibling;
              if (svg) svg.style.display = "flex";
            }}
          />
          {/* SVG fallback avatar — hidden by default */}
          <span
            className="absolute inset-0 items-center justify-center bg-zinc-900"
            style={{ display: "none" }}
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
              <circle cx="50" cy="38" r="22" fill="rgba(255,122,24,0.25)" stroke="#FF7A18" strokeWidth="1.5" />
              <path d="M8 90 C8 68 92 68 92 90" stroke="#FF7A18" strokeWidth="1.5" fill="rgba(255,122,24,0.1)" />
            </svg>
          </span>
          {/* subtle orange glow ring */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ boxShadow: "0 0 40px 4px rgba(255,122,24,0.18)" }}
          />
        </div>

        {/* Name */}
        <h1
          className="mb-3 font-light tracking-tight text-white"
          style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)" }}
        >
          {siteCopy.intro.name}
        </h1>

        {/* Title */}
        <p className="mb-5 text-lg text-white/75">{siteCopy.intro.title}</p>

        {/* Bio */}
        <div className="mb-6 space-y-2 text-sm leading-relaxed text-white/60">
          <p>{siteCopy.intro.bio}</p>
          {siteCopy.intro.bioSecondary && <p>{siteCopy.intro.bioSecondary}</p>}
        </div>

        {/* Contact info */}
        {siteCopy.intro.contact && (
          <div className="mb-6 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs tracking-wide text-white/45">
            {siteCopy.intro.contact.email && (
              <a
                href={`mailto:${siteCopy.intro.contact.email}`}
                className="inline-flex items-center gap-1 transition-colors hover:text-[#FF7A18]"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {siteCopy.intro.contact.email}
              </a>
            )}
            {siteCopy.intro.contact.phone && (
              <span className="inline-flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                </svg>
                {siteCopy.intro.contact.phone}
              </span>
            )}
            {siteCopy.intro.contact.city && (
              <span className="inline-flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {siteCopy.intro.contact.city}
              </span>
            )}
          </div>
        )}

        {/* Skill chips */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {(siteCopy.intro.skillGroups || []).flatMap((group) => group.items).map((skill) => (
            <span
              key={skill}
              className="rounded-full border px-3 py-1 text-xs tracking-wide"
              style={{
                borderColor: "rgba(255,122,24,0.4)",
                background: "rgba(255,122,24,0.08)",
                color: "#FFB58C",
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-4">
          {siteCopy.intro.socials.map((social) => (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="inline-flex items-center justify-center rounded-full border border-white/20 p-2 text-white/70 transition-colors hover:border-[#FF7A18]/70 hover:text-[#FF7A18]"
            >
              <Icon size={20}>{SOCIAL_ICONS[social.id]}</Icon>
            </a>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="mt-12 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs tracking-widest text-white">{siteCopy.intro.scrollHint}</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <rect x="5" y="3" width="6" height="10" rx="3" stroke="white" strokeWidth="1.5" />
            <line x1="8" y1="17" x2="8" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <polyline points="5,19 8,22 11,19" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
      </div>
    </section>
  );
}
