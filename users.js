const API_URL = "http://localhost:666";

async function loadUsers() {
  try {
    const res = await fetch(`${API_URL}/users`);

    if (!res.ok) {
      throw new Error("Chyba při načítání uživatelů");
    }

    const users = await res.json();

    const list = document.querySelector(".user-list");
    list.innerHTML = "";

    users.forEach(u => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="user-detail.html?id=${u.Id}">
        ${u.Name} ${u.Surname}
      </a>`;
      list.appendChild(li);
    });

  } catch (err) {
    console.error(err);
  }
}

loadUsers();