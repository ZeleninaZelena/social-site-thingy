
const API_URL = "http://localhost:666"

document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    Name: document.querySelector("input[placeholder='Jméno']").value,
    Surname: document.querySelector("input[placeholder='Příjmení']").value,
    Age: document.getElementById("age").value,
    Gender: document.querySelector("select").value,
    LoginName: document.querySelector("input[placeholder='Uživatelské jméno']").value,
    LoginPassword: document.querySelector("input[placeholder='Heslo']").value,
  };

  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Registrace úspěšná");
    window.location.href = "login.html";
  }
});