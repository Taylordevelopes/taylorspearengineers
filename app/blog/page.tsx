"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBlogs } from "../lib/api/blogs";
import { BlogPost } from "../types/types";
import { formatUTCDate } from "../utils/usefulReusableFunctions";
import { useAuth } from "../context/AuthContext";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { deleteBlogPost } from "../lib/api/blogs";

export default function page() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBlogs();
        console.log("Fetched blog posts:", data);

        setPosts(Array.isArray(data) ? data : data.blogs || []);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  const handleNewPost = () => {
    router.push("/composeblog");
  };

  const handleDeletePost = async (slug: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteBlogPost(slug);
        setPosts((prevPosts) => prevPosts.filter((post) => post.slug !== slug));
      } catch (error) {
        console.error("Error deleting blog post:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-2">
      <h1 className="flex flex-col text-4xl text-center font-bold">Blog</h1>
      {user && (
        <div className="text-center mb-4">
          <Button variant="primary" onClick={handleNewPost}>
            New Post
          </Button>
        </div>
      )}

      <main className="flex flex-1 w-full max-w-3xl flex-col py-32 px-8 bg-white justify-between">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={post.id}>
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 py-4 items-center">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
                <span className="text-gray-600">
                  {formatUTCDate(post.created_at)}
                </span>
                {user && (
                  <button
                    onClick={() => handleDeletePost(post.slug)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                    title="Delete post"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {index < posts.length - 1 && <hr className="border-gray-200" />}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No blog posts available.</p>
        )}
      </main>
    </div>
  );
}
