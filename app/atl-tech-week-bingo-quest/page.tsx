"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import atltechweeklogo from "../../public/tech-week-logo.png";
import bingoquestlogo from "../../public/bingo-quest-logo.png";
import logo from "../../public/SpearitualCompany_logo.png";
import { Button } from "react-bootstrap";

type Difficulty = "easy" | "medium" | "hard";

interface Task {
  id: string;
  title: string;
  points: number;
  difficulty: Difficulty;
  completed: boolean;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Connected with someone who has an AI startup",
    points: 10,
    difficulty: "medium",
    completed: false,
  },
  {
    id: "2",
    title: "Connected with someone who built with React or Next.js",
    points: 10,
    difficulty: "medium",
    completed: true,
  },
  {
    id: "3",
    title: "Connected with a Full Stack Developer",
    points: 10,
    difficulty: "medium",
    completed: false,
  },
  {
    id: "4",
    title: "Met a Backend Developer",
    points: 10,
    difficulty: "medium",
    completed: false,
  },
  {
    id: "5",
    title: "Connected with a UX/UI Designer",
    points: 10,
    difficulty: "medium",
    completed: true,
  },
  {
    id: "6",
    title: "Met someone visiting from out of state",
    points: 15,
    difficulty: "hard",
    completed: false,
  },
];

const borderColors = [
  "#F28CA6", // Vintage Pink
  "#74C7EC", // Sky Blue
  "#6FCF97", // Mint Green
  "#FFD166", // Bingo Yellow
  "#B497D6", // Soft Lavender
  "#FF9F68", // Coral Orange
];

export default function Page(): React.JSX.Element {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  );

  const remainingChips = tasks.length - completedCount;

  const currentPoints = useMemo(
    () =>
      tasks.reduce(
        (total, task) => total + (task.completed ? task.points : 0),
        0,
      ),
    [tasks],
  );

  const totalPoints = useMemo(
    () => tasks.reduce((total, task) => total + task.points, 0),
    [tasks],
  );

  const toggleTask = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const difficultyStyles: Record<Difficulty, string> = {
    easy: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    hard: "bg-rose-100 text-rose-700",
  };

  return (
    <main className="min-h-screen bg-[#f2f1ed] px-3 py-4 text-[#171717]">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="flex justify-center">
          <div className="relative inline-block">
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

        <div className="mb-2 flex items-center justify-between px-2">
          <p className="font-black tracking-tight">
            <span>SCORE:</span>{" "}
            <span className="text-[#FFD166]">{currentPoints}</span>
          </p>

          <div className="mb-3 flex items-center">
            {Array.from({ length: remainingChips }).map((_, index) => (
              <div
                key={index}
                className="-ml-2 first:ml-0 h-7 w-7 rounded-full border-2 border-[#7fc8ff]/80"
                style={{
                  background:
                    "radial-gradient(circle at 32% 25%, rgba(255,255,255,0.7), rgba(66,153,225,0.72) 38%, rgba(37,99,235,0.78) 72%, rgba(30,64,175,0.85) 100%)",
                  boxShadow:
                    "inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 5px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.18)",
                  opacity: 0.88,
                  transform: `rotate(${index % 2 === 0 ? -6 : 6}deg)`,
                }}
              />
            ))}

            <span className="ml-2 text-[11px] font-black text-[#2F80ED]">
              {remainingChips}
            </span>
          </div>
        </div>
        <section className="grid grid-cols-2 gap-3">
          {tasks.map((task, index) => (
            <button
              key={task.id}
              type="button"
              aria-pressed={task.completed}
              onClick={() => toggleTask(task.id)}
              className="relative aspect-square bg-white p-4 shadow-sm transition-all duration-200 active:scale-95"
              style={{
                borderRadius: 10,
                border: `4px solid ${borderColors[index % borderColors.length]}`,
                boxShadow: "0 2px 4px rgba(0,0,0,.08)",
              }}
            >
              <div className="flex h-full items-center justify-center px-2">
                <p className="text-center text-[15px] font-bold leading-5">
                  {task.title}
                </p>
              </div>
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 text-xs font-bold bg-[#FF9F68] text-white rounded-full">
                + {task.points}
              </span>

              {task.completed && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div
                    className="h-20 w-20 rounded-full border-[4px] border-[#7fc8ff]/80"
                    style={{
                      background:
                        "radial-gradient(circle at 32% 25%, rgba(255,255,255,0.65), rgba(66,153,225,0.72) 38%, rgba(37,99,235,0.78) 72%, rgba(30,64,175,0.85) 100%)",
                      boxShadow:
                        "inset 0 4px 8px rgba(255,255,255,0.35), inset 0 -5px 10px rgba(0,0,0,0.18), 0 8px 14px rgba(0,0,0,0.22)",
                      backdropFilter: "blur(1px)",
                      WebkitBackdropFilter: "blur(1px)",
                      opacity: 0.88,
                    }}
                  />
                </div>
              )}
            </button>
          ))}
        </section>
        <div className="mt-4">
          <Button
            type="button"
            className="
          mb-8
          mt-10
          h-14
          w-full
          rounded-xl
          border-[4px]
          border-[#C76A1E]
          bg-gradient-to-b
          from-[#FFD970]
          to-[#FFBC42]
          text-lg
          font-black
          uppercase
          tracking-wider
          text-[#5B3100]
          shadow-[0_6px_0_#C76A1E]
          transition-all
          hover:-translate-y-1
          hover:shadow-[0_8px_0_#C76A1E]
          active:translate-y-1
          active:shadow-[0_3px_0_#C76A1E]
        "
          >
            BINGO! Submit Score
          </Button>
          <div className="  flex items-center justify-center gap-2 opacity-70">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6b655e]">
              Powered by
            </span>

            <Image
              src={logo}
              alt="Spearitual Company"
              width={76}
              className="h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
