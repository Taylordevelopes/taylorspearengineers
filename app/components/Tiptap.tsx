"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type ToolbarButtonProps = {
  onClick: () => void;
  active: boolean;
  children: React.ReactNode;
};

const ToolbarButton = ({ onClick, active, children }: ToolbarButtonProps) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
      active
        ? "bg-gray-900 text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    {children}
  </button>
);

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start writing...</p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[400px] outline-none prose prose-sm max-w-none text-gray-800",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          H2
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <span className="italic">I</span>
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <div className="px-6 py-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Tiptap;
