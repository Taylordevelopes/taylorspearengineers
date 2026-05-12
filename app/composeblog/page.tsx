import React from "react";
import Tiptap from "../components/Tiptap";

export default function page() {
  return (
    <div className="flex flex-col flex-1 items-center bg-gray-50 py-16 px-4">
      <div className="w-full max-w-3xl mb-6">
        <h1 className="text-3xl font-bold text-gray-900">New Post</h1>
        <p className="text-sm text-gray-500 mt-1">Write and format your article below</p>
      </div>
      <Tiptap />
    </div>
  );
}
