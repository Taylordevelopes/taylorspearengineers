"use client";

import { useState } from "react";
import Image from "next/image";

type App = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  thumbnail: string;
  downloadUrl: string;
  platform: string;
};

const apps: App[] = [
  {
    id: 1,
    name: "Rekord",
    tagline: "Music recording & production",
    description:
      "Rekord is a mobile-first music recording and production app built for creators on the go. Capture ideas, layer tracks, and share your sound with the world.",
    thumbnail: "/rekord-thumb.png",
    downloadUrl: "#",
    platform: "iOS & Android",
  },
  {
    id: 2,
    name: "The Black 411",
    tagline: "Black-owned business directory",
    description:
      "The Black 411 connects communities with Black-owned businesses across the country. Discover, support, and share local businesses with ease.",
    thumbnail: "/black411-thumb.png",
    downloadUrl: "#",
    platform: "iOS & Android",
  },
  {
    id: 3,
    name: "Perkster",
    tagline: "Perks & rewards made simple",
    description:
      "Perkster helps businesses reward their loyal customers with perks, discounts, and exclusive deals — all in one easy-to-use app.",
    thumbnail: "/perkster-thumb.png",
    downloadUrl: "#",
    platform: "iOS & Android",
  },
];

export default function page() {
  const [selected, setSelected] = useState<App | null>(null);

  return (
    <div className="flex flex-col flex-1 items-center bg-gray-50 py-16 px-4">
      <div className="w-full max-w-3xl mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Apps</h1>
      </div>

      {/* App grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full max-w-3xl">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelected(app)}
            className="flex flex-col items-center p-2 hover:opacity-70 transition-opacity duration-200"
          >
            <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden mb-3 flex items-center justify-center">
              <Image
                src={app.thumbnail}
                alt={app.name}
                width={80}
                height={80}
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <p className="font-semibold text-gray-900 text-sm text-center">
              {app.name}
            </p>
            <p className="text-xs text-gray-400 text-center mt-0.5">
              {app.tagline}
            </p>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                <Image
                  src={selected.thumbnail}
                  alt={selected.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selected.name}
                </h2>
                <p className="text-sm text-gray-400">{selected.platform}</p>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {selected.description}
            </p>

            <a
              href={selected.downloadUrl}
              className="block w-full text-center bg-gray-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-700 transition-colors"
            >
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
