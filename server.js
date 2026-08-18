require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const initSocket = require('./socket');

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);
const io = initSocket(server);
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;
