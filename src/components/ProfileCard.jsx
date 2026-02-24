"use client";

import Image from "next/image";

export default function ProfileCard() {
  return (
    <section className="min-h-screen flex items-center justify-center px-8">
      <div className="text-center max-w-2xl">
        {/* Photo */}
        <div 
          className="relative mx-auto mb-8 rounded-full overflow-hidden border border-white/10"
          style={{ width: '256px', height: '256px' }}
        >
          <img
            src="/images/profile.jpg"
            alt="SiCheng Chen"
            className="w-full h-full object-cover"
            style={{ width: '256px', height: '256px' }}
          />
        </div>

        {/* Name & Title */}
        <h1 className="text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
          SiCheng Chen
        </h1>

        {/* Job Title */}
        <p className="text-lg text-gray-300 mb-4">
          Technical Artist / Environment TA (Unreal Engine 5、Unity)
        </p>

        {/* Location & Birthday */}
        <div className="text-sm text-gray-400 mb-4 space-y-1">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>Chengdu, China</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>June 8, 1994</span>
          </div>
        </div>

        {/* Contact */}
        <div className="text-sm text-gray-400 space-y-1">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span>chensicheng0608@outlook.com</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span>+86 155 5333 1116</span>
          </div>
        </div>
      </div>
    </section>
  );
}