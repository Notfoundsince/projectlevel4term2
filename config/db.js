const mongoose = require('mongoose');
const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']); // fixes querySrv ECONNREFUSED on Node 22+/Windows

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
