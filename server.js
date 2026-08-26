const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Serve only the public folder, not the whole project directory
const PUBLIC_DIR = path.join(__dirname, 'public');
app.use(express.static(PUBLIC_DIR));

app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'), (err) => {
        if (err) {
            console.error('Error sending index.html:', err.message);
            res.status(500).send('Server error: could not load page.');
        }
    });
});

// 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).send('404: Page not found.');
});

app.listen(PORT, () => {
    console.log(`Server executing successfully on port ${PORT}`);
});
