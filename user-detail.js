const API_URL = "http://localhost:666";


const params = new URLSearchParams(window.location.search);
const userId = params.get("id");


if (!userId) {
  alert("Chybí ID uživatele");
}


async function loadUser() {
  const res = await fetch(`${API_URL}/users/${userId}`);

  if (!res.ok) {
    alert("Uživatel nenalezen");
    return;
  }

  const user = await res.json();

  document.getElementById("name").innerText =
    user.Name + " " + user.Surname;

  document.getElementById("age").innerText =
    "Věk: " + user.Age;

  if (user.ProfilePicture) {
    document.getElementById("avatar").src = user.ProfilePicture;
  }
}


async function loadPosts() {
  const res = await fetch(`${API_URL}/posts/${userId}`);

  if (!res.ok) return;

  const posts = await res.json();

  const container = document.getElementById("posts");
  container.innerHTML = "";

  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post card";

    div.innerHTML = `
      <h4>${post.Title}</h4>
      <p>${post.Content}</p>
    `;

    container.appendChild(div);
  });
}


loadUser();
loadPosts();