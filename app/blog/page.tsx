import Link from "next/link";

export default function page() {
  const mockPosts = [
    { id: 1, title: "Mocking 101", author: "Jane Doe", date: "2023-01-01" },
    {
      id: 2,
      title: "Advanced Syntax",
      author: "John Smith",
      date: "2023-01-02",
    },
    {
      id: 3,
      title: "Getting Started with TypeScript",
      author: "Alice Chen",
      date: "2023-01-10",
    },
    {
      id: 4,
      title: "React Hooks Deep Dive",
      author: "Bob Martinez",
      date: "2023-01-15",
    },
    {
      id: 5,
      title: "CSS Grid vs Flexbox",
      author: "Sara Kim",
      date: "2023-01-22",
    },
    {
      id: 6,
      title: "Next.js App Router Guide",
      author: "Tom Wilson",
      date: "2023-02-03",
    },
    {
      id: 7,
      title: "State Management in 2023",
      author: "Emily Davis",
      date: "2023-02-11",
    },
    {
      id: 8,
      title: "Testing with Vitest",
      author: "Chris Lee",
      date: "2023-02-18",
    },
    {
      id: 9,
      title: "Tailwind CSS Tips & Tricks",
      author: "Mia Johnson",
      date: "2023-02-25",
    },
    {
      id: 10,
      title: "Building a REST API with Node",
      author: "James Brown",
      date: "2023-03-05",
    },
    {
      id: 11,
      title: "Intro to GraphQL",
      author: "Olivia White",
      date: "2023-03-12",
    },
    {
      id: 12,
      title: "Docker for Developers",
      author: "Liam Garcia",
      date: "2023-03-19",
    },
    {
      id: 13,
      title: "CI/CD with GitHub Actions",
      author: "Sophia Miller",
      date: "2023-03-26",
    },
    {
      id: 14,
      title: "Web Accessibility Basics",
      author: "Noah Taylor",
      date: "2023-04-02",
    },
    {
      id: 15,
      title: "Optimizing Web Performance",
      author: "Isabella Anderson",
      date: "2023-04-09",
    },
    {
      id: 16,
      title: "Introduction to Prisma",
      author: "Mason Thomas",
      date: "2023-04-16",
    },
    {
      id: 17,
      title: "Authentication with NextAuth",
      author: "Ava Jackson",
      date: "2023-04-23",
    },
    {
      id: 18,
      title: "Deploying to Vercel",
      author: "Ethan Harris",
      date: "2023-04-30",
    },
    {
      id: 19,
      title: "Monorepo with Turborepo",
      author: "Charlotte Martin",
      date: "2023-05-07",
    },
    {
      id: 20,
      title: "The Future of Web Dev",
      author: "Lucas Thompson",
      date: "2023-05-14",
    },
  ];
  return (
    <div>
      <h1 className="flex flex-col text-4xl text-center font-bold">Blog</h1>

      <main className="flex flex-1 w-full max-w-3xl flex-col   py-32 px-8  bg-white justify-between ">
        {mockPosts.map((post) => (
          <div key={post.id} className="grid grid-cols-2 gap-4">
            <Link href={`/blog/${post.id}`}>{post.title}</Link>
            <span>{post.date}</span>
          </div>
        ))}
      </main>
    </div>
  );
}
