const http = require('http');
const app = require('./app'); // dotenv.config() runs here, as the first line of app.js
const initSocket = require('./socket');

const PORT = process.env.PORT || 3000;

const start = () => {
  const server = http.createServer(app);
  const io = initSocket(server);
  app.set('io', io);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Only start a listening server + Socket.io when run directly (local dev,
// or a persistent host). On Vercel, this file is required as a module and
// the exported Express app is invoked per-request instead.
if (require.main === module) {
  start();
}

module.exports = app;
