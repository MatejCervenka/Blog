const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const crypto = require('crypto');
const { exec } = require('child_process');
const bodyParser = require('body-parser');

const port = 3000;
const dotenv = require('dotenv');

// Načtení proměnných z config.env souboru
dotenv.config({ path: './config.env' });

const secret = '0971';

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

// Function to verify the GitHub webhook signature
function verifySignature(req, res, next) {
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);

    if (!signature || !payload) {
        return res.status(403).send('Access denied');
    }

    const hash = `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(hash))) {
        next();
    } else {
        res.status(403).send('Invalid signature');
    }
}

// Webhook handler for GitHub push events
app.post('/webhook-handler', verifySignature, (req, res) => {
    if (req.body.ref === 'refs/heads/main') {
        // Run the deployment script when push to main branch occurs
        exec('/usr/local/bin/deploy.sh', (err, stdout, stderr) => {
            if (err) {
                console.error(`Error executing deploy script: ${stderr}`);
                return res.status(500).send('Error occurred during deployment');
            }
            console.log(`Deploy script output: ${stdout}`);
            res.status(200).send('Deployment successful');
        });
    } else {
        res.status(200).send('Push event on non-main branch, no deployment');
    }
});

// Spuštění serveru
app.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
});