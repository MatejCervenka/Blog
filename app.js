const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const dotenv = require('dotenv');

// Načtení proměnných z config.env souboru
dotenv.config({ path: './config.env' });


app.use(bodyParser.json());

// Připojení k MySQL databázi
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Připojení k databázi
db.connect(err => {
    if (err) {
        console.error('Chyba při připojení k databázi: ' + err.stack);
        return;
    }
    console.log('Připojeno k databázi.');
});

// Nastavení statických souborů (HTML, CSS, JavaScript)
app.use(express.static(path.join(__dirname)));

// Route pro získání příspěvků z databáze
app.get('/posts', (req, res) => {
    console.log('Fetching posts...');
    const query = 'SELECT * FROM posts ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Add new post
app.post('/add_post', (req, res) => {
    const { title, content } = req.body;
    const sql = 'INSERT INTO posts (title, content, created_at) VALUES (?, ?, NOW())';
    db.query(sql, [title, content], (err) => {
        if (err) {
            res.status(500).send('Error inserting post');
        } else {
            res.status(200).send('Post added');
        }
    });
});

// Spuštění serveru
app.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
});
