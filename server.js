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

// Intercept specific routes to prevent direct URL access
app.use((req, res, next) => {
  const protectedRoutes = ['/admin', '/student', '/teacher'];
  
  if (protectedRoutes.some(route => req.path.startsWith(route))) {
    // Force direct URL manipulation to route to the login page as requested
    return res.redirect('/login');
  }
  next();
});


let htmlContent = '';
try {
  htmlContent = fs.readFileSync(path.join(__dirname, 'dist', 'index.html'), 'utf-8');
} catch (e) {
  htmlContent = "Error: React app not built. Run 'npm run build'.";
}

// Catch-all route for SPA
app.use((req, res) => {
  if (htmlContent.startsWith("Error")) {
    res.status(404).send(htmlContent);
  } else {
    res.status(200).set('Content-Type', 'text/html').send(htmlContent);
  }
});

const server = app.listen(PORT, () => {
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


