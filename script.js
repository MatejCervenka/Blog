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

document.getElementById('post-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    try {
        const response = await fetch('/add_post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });

        if (!response.ok) {
            const errorMessage = await response.text(); // Read the response body
            console.error(`Error: ${response.status} ${response.statusText}. Message: ${errorMessage}`);
            throw new Error(`Failed to add post: ${response.status}`);
        }

        // Reload posts after adding new post
        loadPosts();
    } catch (error) {
        console.error('Error:', error);
    }
});

// Function to load posts
async function loadPosts() {
    const response = await fetch('/posts');
    const posts = await response.json();

    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // Clear previous posts

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p><hr>`;
        postsContainer.appendChild(postElement);
    });
}

// Load posts on page load
window.onload = loadPosts;
