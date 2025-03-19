const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3002; // Changed from 3001 to avoid conflicts

// Enable CORS for all routes
app.use(cors());

// Serve static files from the swagger-ui directory
app.use(express.static(path.join(__dirname, 'swagger-ui')));

// Serve swagger-ui at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'swagger-ui', 'index.html'));
});

app.listen(port, () => {
    console.log(`Swagger UI server running at http://localhost:${port}`);
}); 