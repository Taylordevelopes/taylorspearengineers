// lib/api/auth.ts

export async function login(email: string, password: string) {
  const res = await fetch("https://api.spearitual.xyz/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}

export async function playerLogin(email: string, code: number) {
  const res = await fetch("https://api.spearitual.xyz/playerLogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}

export async function playerSignUp(name: string, email: string) {
  const res = await fetch("https://api.spearitual.xyz/playerSignUp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}

// lib/api/auth.ts

export async function getPlayerBoard() {
  const token = localStorage.getItem("token");

  const res = await fetch("https://api.spearitual.xyz/game/playerBoard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Unable to load board");
  }

  return data;
}

export async function updatePlayerBoardTask(
  playerBoardTaskId: string,
  isCompleted: boolean,
) {
  if (!playerBoardTaskId) {
    throw new Error("Missing player board task ID");
  }

  const token = localStorage.getItem("token");

  const response = await fetch(
    `https://api.spearitual.xyz/game/playerBoard/${playerBoardTaskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        isCompleted,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to update task");
  }

  return data;
}
export async function createNewPlayerBoard() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    "https://api.spearitual.xyz/game/playerBoard/new",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to create a new card");
  }

  return data;
}

export async function submitScore() {
  const token = localStorage.getItem("token");

  const res = await fetch("https://api.spearitual.xyz/game/submitScore", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Unable to submit score");
  }

  return data;
}
