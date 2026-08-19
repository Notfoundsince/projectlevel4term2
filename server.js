require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const initSocket = require('./socket');

connectDB();

// Only start a listening server + Socket.io when run directly (local dev,
// or a persistent host). On Vercel, this file is required as a module and
// the exported Express app is invoked per-request instead.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  const server = http.createServer(app);
  const io = initSocket(server);
  app.set('io', io);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
