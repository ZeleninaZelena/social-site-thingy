const API_URL = "http://localhost:666"

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    alert("Špatné přihlášení");
    return;
  }

  const user = await res.json();

  // uložíme uživatele
  localStorage.setItem("user", JSON.stringify(user));

  window.location.href = "wall.html";
});

function logout() {
  localStorage.removeItem("user")
};