// Fetch and display posts from the server
fetch('/posts')
    .then(response => response.json())
    .then(posts => {
        const postsDiv = document.getElementById('posts');
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <small>Posted on ${new Date(post.created_at).toLocaleDateString()}</small>
      `;
            postsDiv.appendChild(postElement);
        });
    })
    .catch(error => console.error('Error fetching posts:', error));
