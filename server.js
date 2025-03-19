<<<<<<< HEAD
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const port = 8000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
=======
const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable compression
app.use(compression());

// Logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });
    next();
});

// Serve static files with proper caching headers
app.use(express.static(path.join(__dirname, 'bosaKitchenfrontend'), {
    setHeaders: (res, filePath) => {
        // Disable caching for HTML files
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
        // Set cache duration for CSS and JS files
        else if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
            res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour
        }
        // Set cache duration for images
        else if (filePath.match(/\.(jpg|jpeg|png|gif|ico)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours
        }
        
        // Set content type headers
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Serve index.html for the root route
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'bosaKitchenfrontend', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error('index.html not found at:', indexPath);
        res.status(404).send('index.html not found');
    }
});

// Log directory contents on startup
const frontendDir = path.join(__dirname, 'bosaKitchenfrontend');
console.log('Frontend directory contents:', fs.readdirSync(frontendDir));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Serving files from: ${frontendDir}`);
>>>>>>> 54b6a39 (Updated local project with changes)
}); 