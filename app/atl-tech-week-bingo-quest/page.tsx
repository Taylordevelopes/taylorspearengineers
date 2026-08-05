"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import atltechweeklogo from "../../public/tech-week-logo.png";
import bingoquestlogo from "../../public/bingo-quest-logo.png";
import logo from "../../public/SpearitualCompany_logo.png";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import {
  getPlayerBoard,
  updatePlayerBoardTask,
  createNewPlayerBoard,
  submitScore,
} from "../lib/api/auth";
import { useRouter } from "next/navigation";

import { useAuth } from "../context/AuthContext";

type Difficulty = "easy" | "medium" | "hard";

interface Task {
  player_board_task_id: string;
  task_id: string;
  title: string;
  points: number;
  difficulty: Difficulty;
  is_completed: boolean;
  board_position: number;
}

const borderColors = [
  "#F28CA6", // Vintage Pink
  "#74C7EC", // Sky Blue
  "#6FCF97", // Mint Green
  "#FFD166", // Bingo Yellow
  "#B497D6", // Soft Lavender
  "#FF9F68", // Coral Orange
];

export default function Page(): React.JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { player, handlePlayerSignUp, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [boardLoading, setBoardLoading] = useState(true);
  const [boardError, setBoardError] = useState("");
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [newCardError, setNewCardError] = useState("");
  const router = useRouter();
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const submitPlayerSignup = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail) {
      setSignupError("Please enter your name and email.");
      return;
    }

    try {
      setIsSigningUp(true);
      setSignupError("");

      await handlePlayerSignUp(normalizedName, normalizedEmail);
    } catch (error) {
      setSignupError(
        error instanceof Error
          ? error.message
          : "Unable to join the game. Please try again.",
      );
    } finally {
      setIsSigningUp(false);
    }
  };
  const handleNewCard = async () => {
    try {
      setIsCreatingCard(true);
      setNewCardError("");

      const data = await createNewPlayerBoard();

      setTasks(data.board);
    } catch (error) {
      setNewCardError(
        error instanceof Error ? error.message : "Unable to create a new card",
      );
    } finally {
      setIsCreatingCard(false);
    }
  };

  const completedCount = useMemo(
    () => tasks.filter((task) => task.is_completed).length,
    [tasks],
  );

  const remainingChips = tasks.length - completedCount;

  const currentPoints = useMemo(
    () =>
      tasks.reduce(
        (total, task) => total + (task.is_completed ? task.points : 0),
        0,
      ),
    [tasks],
  );

  const totalPoints = useMemo(
    () => tasks.reduce((total, task) => total + task.points, 0),
    [tasks],
  );

  const toggleTask = async (playerBoardTaskId: string) => {
    const selectedTask = tasks.find(
      (task) => task.player_board_task_id === playerBoardTaskId,
    );

    if (!selectedTask) {
      return;
    }

    const nextCompletedState = !selectedTask.is_completed;

    try {
      const data = await updatePlayerBoardTask(
        playerBoardTaskId,
        nextCompletedState,
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.player_board_task_id === playerBoardTaskId
            ? {
                ...task,
                is_completed: data.boardTask.is_completed,
              }
            : task,
        ),
      );
    } catch (error) {
      console.error("Unable to update task:", error);
    }
  };

  const handleSubmitScore = async () => {
    try {
      setIsSubmittingScore(true);
      setSubmitError("");

      await submitScore();

      router.push("/thanks");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to submit your score",
      );
    } finally {
      setIsSubmittingScore(false);
    }
  };

  const difficultyStyles: Record<Difficulty, string> = {
    easy: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    hard: "bg-rose-100 text-rose-700",
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!player) {
      setTasks([]);
      setBoardLoading(false);
      return;
    }

    const loadBoard = async () => {
      try {
        setBoardLoading(true);
        setBoardError("");

        const data = await getPlayerBoard();

        setTasks(data.board);
      } catch (error) {
        setBoardError(
          error instanceof Error ? error.message : "Unable to load your board",
        );
      } finally {
        setBoardLoading(false);
      }
    };

    loadBoard();
  }, [player, authLoading]);

  return (
    <main className="min-h-screen  px-3 py-4 text-[#171717]">
      <Modal
        show={!authLoading && !player}
        centered
        backdrop="static"
        keyboard={false}
        contentClassName="overflow-hidden border-0 bg-[#f2f1ed]"
      >
        <Modal.Body className="p-0">
          <div className="px-5 pb-6 pt-5">
            <div className="flex justify-center">
              <div className="relative inline-block ">
                <Image
                  src={atltechweeklogo}
                  alt="Atlanta Tech Week"
                  width={205}
                  priority
                />

                <Image
                  src={bingoquestlogo}
                  alt="Bingo Quest"
                  width={100}
                  className="absolute -bottom-1 -right-5 rotate-[-8deg] drop-shadow-lg"
                />
              </div>
            </div>

            <div className="mt-3 text-center">
              <h1 className="text-2xl font-black text-[#171717]">
                Join the Quest!
              </h1>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-5 text-[#6b655e]">
                ATL Tech Week is here and your next big opportunity could be
                right in front of you!
              </p>

              <div className="mx-auto mt-4 max-w-xs text-left text-sm text-[#6b655e]">
                <p className="mb-2 font-bold text-[#171717]">How to Play</p>

                <ul className="list-disc space-y-2 pl-5">
                  <li>Complete as many quests as you can.</li>
                  <li>
                    Tap a square after you've completed a quest to place your
                    bingo chip.
                  </li>

                  <li>
                    When you're finished, tap{" "}
                    <strong>"BINGO! Submit Score"</strong>.
                  </li>

                  <li>Most importantly, meet new people and have fun. </li>
                  <li>Participate and get a free coffee while supplies last</li>
                </ul>
              </div>

              <p className="mx-auto mt-5 max-w-xs text-sm leading-5 text-[#6b655e]">
                Enter your information below to receive your board and start
                playing.
              </p>
            </div>

            <Form onSubmit={submitPlayerSignup} className="mt-6">
              <Form.Group className="mb-4 text-left" controlId="playerName">
                <Form.Label className="mb-1 text-sm font-bold text-[#171717]">
                  Your name
                </Form.Label>

                <Form.Control
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Full Name"
                  autoComplete="name"
                  disabled={isSigningUp}
                  className="h-12 border-2 border-[#74C7EC] bg-white px-3 text-base shadow-none"
                  style={{ borderRadius: 10 }}
                />
              </Form.Group>

              <Form.Group className="mb-4 text-left" controlId="playerEmail">
                <Form.Label className="mb-1 text-sm font-bold text-[#171717]">
                  Email address
                </Form.Label>

                <Form.Control
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isSigningUp}
                  className="h-12 border-2 border-[#F28CA6] bg-white px-3 text-base shadow-none"
                  style={{ borderRadius: 10 }}
                />
              </Form.Group>

              {signupError && (
                <div
                  role="alert"
                  className="mb-4 border-2 border-[#E8893D] bg-[#FFF3BF] px-3 py-2 text-left text-sm font-semibold text-[#5B3100]"
                  style={{ borderRadius: 10 }}
                >
                  {signupError}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSigningUp}
                className="
            h-14
            w-full
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
            active:translate-y-1
            active:shadow-[0_3px_0_#C76A1E]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
                style={{ borderRadius: 10 }}
              >
                {isSigningUp ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner animation="border" size="sm" />
                    Joining...
                  </span>
                ) : (
                  "Join the Quest"
                )}
              </Button>
            </Form>

            <div className="mt-7 flex items-center justify-center gap-2 opacity-70">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#6b655e]">
                Powered by
              </span>

              <Image
                src={logo}
                alt="Spearitual Company"
                width={72}
                className="h-auto object-contain"
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
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
        {player && boardLoading && (
          <div className="py-10">
            <Spinner animation="border" />
            <p className="mt-3 text-sm font-semibold text-[#6b655e]">
              Loading your board...
            </p>
          </div>
        )}

        {player && boardError && (
          <div
            className="mb-5 border-2 border-[#E8893D] bg-[#FFF3BF] p-3 text-sm font-semibold text-[#5B3100]"
            style={{ borderRadius: 10 }}
          >
            {boardError}
          </div>
        )}
        {player && !boardLoading && !boardError && (
          <section className="grid grid-cols-2 gap-3">
            {tasks.map((task, index) => (
              <button
                key={task.task_id}
                type="button"
                aria-pressed={task.is_completed}
                onClick={() => toggleTask(task.player_board_task_id)}
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

                {task.is_completed && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div
                      className="h-20 w-20 rounded-full border-4px border-[#7fc8ff]/80"
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
        )}
        <div className="mt-4">
          <Button
            type="button"
            onClick={handleSubmitScore}
            disabled={isSubmittingScore}
            className="
          mb-8
          mt-10
          h-14
          w-full
          rounded-xl
          border-4px
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
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={handleNewCard}
              className="text-[12px] font-bold text-[#5BA8F5] transition-opacity hover:opacity-70"
            >
              ↻ Tap for a different card!
            </button>
          </div>

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
