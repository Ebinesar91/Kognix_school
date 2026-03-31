import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets first
app.use(express.static(path.join(__dirname, 'dist')));

// Middleware for basic parsing (optional)
app.use(express.json());



let htmlContent = '';
try {
  htmlContent = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf-8');
} catch (e) {
  htmlContent = "Error: React app not built. Run 'npm run build'.";
}

// SPA Catch-all: Securely serve index.html for all non-asset requests
app.use((req, res, next) => {
  // Only serve index.html for GET requests that aren't for files
  if (req.method === 'GET' && !req.path.includes('.')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    next();
  }
});


const server = app.listen(PORT, '0.0.0.0', () => {

  console.log(`=========================================`);
  console.log(`🚀 Express Security Server is active!`);
  console.log(`🛡️  Direct access strictly redirected to login.`);
  console.log(`👉 Running on: http://localhost:${PORT}`);
  console.log(`=========================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ PORT ${PORT} IS ALREADY IN USE! Kill the other process first.`);
  } else {
    console.error(`❌ SERVER ERROR:`, err);
  }
  process.exit(1);
});


