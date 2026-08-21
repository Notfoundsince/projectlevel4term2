const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']); // fixes querySrv ECONNREFUSED on Node 22+/Windows

// Background connection errors from the driver (e.g. auth failures during
// pool retries) don't go through connectDB()'s own try/catch - without this
// listener they can crash the whole process as an unhandled rejection.
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

let connectionPromise = null;

const connectDB = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve();

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI).catch((err) => {
      connectionPromise = null; // allow retry on the next request
      throw err;
    });
  }

  return connectionPromise;
};

module.exports = connectDB;
