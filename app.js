const userId = 1; // temporary test user

function showPostBox() {
  document.getElementById('postBox').style.display = 'block';
}

function submitPost() {
  const contentBox = document.getElementById('newPostContent');
  const content = contentBox.value.trim();
  if (!content) return;

  fetch('http://localhost:3000/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, content })
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to post');
      return res.json();
    })
    .then(() => {
      contentBox.value = '';
      fetchPosts();
    })
    .catch(err => alert('Error posting: ' + err.message));
}

function fetchPosts() {
  fetch('http://localhost:3000/api/posts')
    .then(res => res.json())
    .then(posts => {
      const feed = document.getElementById('feed');
      feed.innerHTML = '';
      posts.forEach(post => {
        const isUserPost = post.user_id === userId;
        const div = document.createElement('div');
        div.className = 'post';
        div.innerHTML = `
          <h3>👤 ${post.username}${isUserPost ? ' <span style="color:#888; font-size:0.9em">(You)</span>' : ''}</h3>
          <p>${post.content}</p>
          <div>❤️ ${post.likes} likes</div>
          <div class="actions">
            <button onclick="likePost(${post.id})">👍 Like</button>
            <button onclick="viewProfile(${post.user_id})">🔍 View Profile</button>
            ${isUserPost ? `<button onclick="deletePost(${post.id})" style="background:#ffcccc;">🗑️ Delete</button>` : ''}
          </div>
          <div id="comments-${post.id}">Loading comments...</div>
          <div class="comment-box">
            <input id="comment-${post.id}" placeholder="Write a comment...">
            <button onclick="comment(${post.id})">💬 Comment</button>
          </div>
        `;
        feed.appendChild(div);
        fetchComments(post.id);
      });
    });
}

function likePost(postId) {
  fetch('http://localhost:3000/api/posts/like', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, post_id: postId })
  }).then(() => fetchPosts());
}

function comment(postId) {
  const input = document.getElementById(`comment-${postId}`);
  const comment = input.value.trim();
  if (!comment) return;

  fetch('http://localhost:3000/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, post_id: postId, comment })
  }).then(() => {
    input.value = '';
    fetchPosts();
  });
}

function fetchComments(postId) {
  fetch(`http://localhost:3000/api/comments/${postId}`)
    .then(res => res.json())
    .then(comments => {
      const commentSection = document.getElementById(`comments-${postId}`);
      if (!comments.length) {
        commentSection.innerText = 'No comments yet';
        return;
      }
      commentSection.innerHTML = comments
        .map(c => `<div><strong>${c.username}</strong>: ${c.comment}</div>`)
        .join('');
    });
}

function deletePost(postId) {
  if (!confirm('Are you sure you want to delete this post?')) return;
  fetch(`http://localhost:3000/api/posts/${postId}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(() => fetchPosts());
}

function viewProfile(userId) {
  alert(`Profile of user: ${userId || localStorage.getItem('username')}`);
}



function logout() {
  alert('Logged out');
}

window.onload = fetchPosts;
