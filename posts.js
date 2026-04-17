
const API_URL = "http://localhost:666"



async function loadPosts() {
    try {
        const res = await fetch(`${API_URL}/posts`);

        if (!res.ok) {
            throw new Error("Chyba při načítání postů");
        }

        const posts = await res.json();



        const container = document.getElementById("posts");
        container.innerHTML = "";

        const fragment = document.createDocumentFragment();

        for (let post of posts) {
            const div = document.createElement("div");
            div.className = "post card";
            const author = await loadUser(post.AuthorId)
            const numOfLikes = await getNumberOfLikes(post.Id)
            div.innerHTML = `
                <h4>${author.Name} ${author.Surname}</h4>
                <h5>${post.CreatedAt}</h5>
                <h3>${post.Title}</h3>
                <p>${post.Content}</p>
                <button class="button-like" onclick="likePost(${post.Id})">❤️</button><span>${numOfLikes}</span>
                <div id="comments-${post.Id}"></div>
                <input id="comment-input-${post.Id}" type="text" placeholder="Komentář" data-id="${post.Id}" class="comment-input">
                <button class="button-comment" onclick="addCommentFromButton(${post.Id})">Přidat komentář</button>
                `;

            fragment.appendChild(div);

            loadComments(post.Id);
        }
        container.appendChild(fragment)
    } catch (err) {
        console.error(err);
    }
}

loadPosts();

async function addPost() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Musíš být přihlášen");
        return;
    }

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            AuthorId: user.Id,
            Title: title,
            Content: content
        })
    });

    loadPosts();
}


async function loadComments(postId) {
    const res = await fetch(`${API_URL}/posts/comments/${postId}`);
    const comments = await res.json();

    const container = document.getElementById(`comments-${postId}`);
    container.innerHTML = "";

    const fragment = document.createDocumentFragment();

    for(let comment of comments){
        const div = document.createElement("div");
        const author = await loadUser(comment.AuthorId)
        div.className = "comment";
        div.innerHTML = `
        <h5>${author.Name} ${author.Surname}<h5>
        <p>${comment.Content}</p>
        `; 
        fragment.appendChild(div);
    }
    container.appendChild(fragment)
    
}

async function addComment(postId, content) {
  const user = JSON.parse(localStorage.getItem("user"));

  await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      AuthorId: user.Id,
      PostId: postId,
      Content: content
    })
  });

  loadComments(postId);
}

async function loadUser(userId) {
    const res = await fetch(`${API_URL}/users/${userId}`);
    return await res.json();
}

async function getNumberOfLikes(postId){
    const res = await fetch(`${API_URL}/likes/${postId}`);
    const likes = await res.json();

    let numOfLikes = 0;

    for(let like of likes){
        numOfLikes++;
    }
    return numOfLikes;
}


window.likePost = async function(postId) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Musíš být přihlášen");
    return;
  }

  await fetch(`${API_URL}/likes`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      UserId: user.Id,
      PostId: postId
    })
  });

  alert("Lajknuto");
  loadPosts();
}

window.addCommentFromButton = async function(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();
    if (!content) return;

    await addComment(postId, content);
    input.value = "";
}