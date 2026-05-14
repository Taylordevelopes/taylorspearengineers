"use client";
import React, { useState } from "react";
import Tiptap from "../components/Tiptap";
import { Button, Form } from "react-bootstrap";
import { createBlogPost } from "../lib/api/blogs";
import { useAuth } from "../context/AuthContext";

export default function page() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting blog post:", {
      title,
      body: content,
    });

    const result = await createBlogPost({
      title,
      body: content,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      published: true,
      blogger_id: user?.id || "",
    });

    alert(
      `Blog post ready to submit!\n\nTitle: ${title}\n\nBody length: ${content.length} characters`,
    );
  };

  return (
    <div className="flex flex-col flex-1 items-center bg-gray-50 py-16 px-4">
      <Form onSubmit={handleSubmit} className="w-full max-w-3xl">
        <div className="mb-6">
          <Form.Control
            type="text"
            placeholder="Enter your blog title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="text-3xl font-bold border-0 border-b-2 border-gray-300 focus:border-blue-500 px-0 py-3"
            style={{
              outline: "none",
              boxShadow: "none",
              backgroundColor: "transparent",
            }}
          />
          <p className="text-sm text-gray-500 mt-2">
            Write and format your article below
          </p>
        </div>

        <Tiptap content={content} onChange={setContent} />

        <div className="mt-6 flex gap-3 justify-end">
          <Button variant="outline-secondary" type="button">
            Save Draft
          </Button>
          <Button variant="primary" type="submit">
            Publish
          </Button>
        </div>
      </Form>
    </div>
  );
}
