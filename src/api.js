const API_URL = import.meta.env.VITE_API_URL;

// Login user
export async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/loginstud.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  return await response.json();
}

// Fetch user scores
export async function getScores(userId) {
  const response = await fetch(`${API_URL}/fetch_scores.php?id=${userId}`);
  return await response.json();
}