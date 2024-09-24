document.addEventListener('DOMContentLoaded', () => {
    fetch('/posts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(posts => {
            const postsContainer = document.getElementById('posts-container'); // Adjust this ID based on your HTML
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `<h2>${post.title}</h2><p>${post.content}</p>`;
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});
