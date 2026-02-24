"use client";

import { Suspense } from "react";
import HeaderMiniPlayer from "../components/product/HeaderMiniPlayer";
import IntroSection from "../components/product/IntroSection";
import WorksSection from "../components/product/WorksSection";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeaderMiniPlayer />
      <IntroSection />
      <Suspense fallback={<section className="mx-auto w-full max-w-7xl px-4 py-10 md:py-14" />}>
        <WorksSection />
      </Suspense>
    </main>
  );
}