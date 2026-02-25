"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "./AdminProvider";
import { useSiteCopy } from "../i18n/LanguageProvider";

export default function AdminGate({ children }) {
  const { isAdmin, login } = useAdmin();
  const router = useRouter();
  const siteCopy = useSiteCopy();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (isAdmin) return children;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) {
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-5 rounded-xl border border-white/10 bg-black/50 p-8 backdrop-blur-md"
      >
        <h2 className="text-center text-lg font-semibold text-white">
          Admin Access
        </h2>
        <p className="text-center text-sm text-white/50">
          Enter the admin password to continue.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          placeholder="Password"
          autoFocus
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#FF7A18]/50"
        />
        {error && (
          <p className="text-center text-xs text-red-400">Incorrect password</p>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex-1 rounded-lg border border-white/15 px-4 py-2.5 text-sm text-white/65 transition-colors hover:border-white/30"
          >
            {siteCopy.common?.back || "Back"}
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg border border-[#FF7A18]/40 bg-[#FF7A18]/10 px-4 py-2.5 text-sm font-medium text-[#FFB58C] transition-colors hover:bg-[#FF7A18]/20"
          >
            Login
          </button>
        </div>
      </form>
    </main>
  );
}
