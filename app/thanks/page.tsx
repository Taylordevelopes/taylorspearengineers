"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import atltechweeklogo from "../../public/tech-week-logo.png";
import bingoquestlogo from "../../public/bingo-quest-logo.png";
import spearitualLogo from "../../public/SpearitualCompany_logo.png";

export default function ThanksPage(): React.JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f2f1ed] px-4 py-10 text-[#171717]">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center">
          <div className="relative inline-block ">
            <Image
              src={atltechweeklogo}
              alt="Atlanta Tech Week"
              width={225}
              priority
            />

            <Image
              src={bingoquestlogo}
              alt="Bingo Quest"
              width={110}
              className="absolute -bottom-1 -right-6 rotate-[-8deg] drop-shadow-lg"
            />
          </div>
        </div>

        <section
          className="mt-6 border-[4px] border-[#070707] bg-white px-6 py-8 shadow-sm"
          style={{ borderRadius: 10 }}
        >
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[4px] border-[#7fc8ff]/80"
            style={{
              background:
                "radial-gradient(circle at 32% 25%, rgba(255,255,255,0.7), rgba(66,153,225,0.72) 38%, rgba(37,99,235,0.78) 72%, rgba(30,64,175,0.85) 100%)",
              boxShadow:
                "inset 0 4px 8px rgba(255,255,255,0.35), inset 0 -5px 10px rgba(0,0,0,0.18), 0 8px 14px rgba(0,0,0,0.2)",
              opacity: 0.9,
            }}
          >
            <span className="text-3xl font-black text-white">✓</span>
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight">
            Thanks for Playing!
          </h1>

          <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#6b655e]">
            Hope you had fun and made some amazing connections!
          </p>

          <p className="mt-5 font-black text-[#d968ff]">
            Enjoy the rest of Atlanta Tech Week!
          </p>
          <Link
            href="/"
            className="mt-7 inline-block text-xs font-bold uppercase tracking-[0.15em] text-[#2F80ED] underline underline-offset-4"
          >
            Check us out at spearitual.xyz
          </Link>
        </section>

        <div className="mt-8 flex items-center justify-center gap-2 opacity-70">
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#6b655e]">
            Powered by
          </span>

          <Image
            src={spearitualLogo}
            alt="Spearitual Company"
            width={76}
            className="h-auto object-contain"
          />
        </div>
      </div>
    </main>
  );
}
