const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 80;

// Připojení k MySQL databázi
const db = mysql.createConnection({
    host: '13.60.255.249',
    user: 'root',        // Použijte své uživatelské jméno MySQL
    password: '',  // Heslo k MySQL
    database: 'blog'     // Název databáze
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
    const query = 'SELECT * FROM posts ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Spuštění serveru
app.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
});
