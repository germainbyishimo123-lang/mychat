const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json({ limit: '10mb' })); // 10mb so profile pictures/base64 images fit
app.use(express.static(__dirname)); // serves your html/css/js files directly

// ---- helpers to read/write the data file ----

function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        return { profile: {}, posts: [] };
    }
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch (err) {
        console.error('Could not read data.json, starting fresh:', err);
        return { profile: {}, posts: [] };
    }
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ---- profile endpoints ----

app.get('/api/profile', (req, res) => {
    const data = readData();
    res.json(data.profile || {});
});

app.post('/api/profile', (req, res) => {
    const data = readData();
    data.profile = req.body;
    writeData(data);
    res.json({ success: true });
});

// ---- posts endpoints ----

app.get('/api/posts', (req, res) => {
    const data = readData();
    res.json(data.posts || []);
});

app.post('/api/posts', (req, res) => {
    const data = readData();
    if (!Array.isArray(data.posts)) data.posts = [];
    data.posts.push(req.body);
    writeData(data);
    res.json({ success: true });
});

// ---- start the server ----

app.listen(PORT, () => {
    console.log('MyChat server running at http://localhost:' + PORT);
});