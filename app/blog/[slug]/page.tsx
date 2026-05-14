"use client";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { getBlogBySlug, updateBlogPost } from "../../lib/api/blogs";
import { BlogPost } from "../../types/types";
import { formatUTCDate } from "../../utils/usefulReusableFunctions";
import { useAuth } from "../../context/AuthContext";
import { Button, Form } from "react-bootstrap";
import Tiptap from "../../components/Tiptap";

export default function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [post, setPost] = React.useState<BlogPost | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const unwrappedParams = React.use(params);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBlogBySlug(unwrappedParams.slug);
        console.log("Fetched blog post data:", data);
        const blogPost = data.blog || data;
        setPost(blogPost);
        // Initialize edit fields with current post data
        setEditTitle(blogPost.title);
        setEditBody(blogPost.body);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load blog post",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [unwrappedParams.slug]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit - reset to original values
      setEditTitle(post?.title || "");
      setEditBody(post?.body || "");
    }
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = async () => {
    if (!post) return;

    try {
      await updateBlogPost({
        slug: post.slug,
        title: editTitle,
        body: editBody,
        published: post.published,
      });

      // Update local state
      setPost({
        ...post,
        title: editTitle,
        body: editBody,
      });

      setIsEditing(false);
      alert("Blog post updated successfully!");
    } catch (err) {
      console.error("Error updating blog post:", err);
      alert("Failed to update blog post");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Link href="/blog" className="text-blue-600 hover:underline">
            ← Back to blog
          </Link>
          {user && (
            <Link
              href={`/blog/${post?.slug}/edit`}
              className="text-blue-600 hover:underline"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Blog post not found.</p>
          <Link href="/blog" className="text-blue-600 hover:underline">
            ← Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <article className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to blog
          </Link>

          {user && (
            <button
              onClick={handleEditToggle}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isEditing
                      ? "M6 18L18 6M6 6l12 12"
                      : "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  }
                />
              </svg>
              {isEditing ? "Cancel" : "Edit"}
            </button>
          )}
        </div>

        {isEditing ? (
          // Edit Mode
          <div>
            <Form.Control
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-4xl md:text-5xl font-bold border-0 border-b-2 border-gray-300 focus:border-blue-500 px-0 py-3 mb-4"
              style={{
                outline: "none",
                boxShadow: "none",
                backgroundColor: "transparent",
              }}
            />
            <time className="text-gray-500 block mb-8">
              {formatUTCDate(post.created_at)}
            </time>

            <Tiptap content={editBody} onChange={setEditBody} />

            <div className="mt-6 flex gap-3 justify-end">
              <Button variant="outline-secondary" onClick={handleEditToggle}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          // View Mode
          <>
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              <time className="text-gray-500">
                {formatUTCDate(post.created_at)}
              </time>
            </header>

            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.body }}
                />
              </div>
            </div>
          </>
        )}
      </article>
    </div>
  );
}
