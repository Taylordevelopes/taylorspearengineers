"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { useCallback } from "react";

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

type TiptapProps = {
  content?: string;
  onChange?: (content: string) => void;
};

const Tiptap = ({
  content = "<p>Start writing...</p>",
  onChange,
}: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
      Underline,
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[400px] outline-none prose prose-sm max-w-none text-gray-800",
      },
    },
    onUpdate: ({ editor }) => {
      // Get HTML content
      const html = editor.getHTML();
      // Call onChange callback if provided
      onChange?.(html);
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
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
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <span className="underline">U</span>
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton onClick={setLink} active={editor.isActive("link")}>
          <span className="text-sm">🔗</span>
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
