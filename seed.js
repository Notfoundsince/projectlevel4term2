require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Event = require('./models/Event');

const seed = async () => {
  await connectDB();

  await User.deleteMany();
  await Category.deleteMany();
  await Event.deleteMany();

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@eventpulse.com',
    password: hashedPassword,
    role: 'admin',
  });

  const categories = await Category.insertMany([
    { name: 'Music' },
    { name: 'Tech' },
    { name: 'Sports' },
  ]);

  await Event.insertMany([
    {
      title: 'Summer Music Festival',
      description: 'A weekend of live performances from top artists.',
      category: categories[0]._id,
      date: new Date('2026-07-15'),
      city: 'Cairo',
      capacity: 200,
    },
    {
      title: 'Tech Innovators Summit',
      description: 'Talks and workshops on the latest in technology.',
      category: categories[1]._id,
      date: new Date('2026-09-10'),
      city: 'Dubai',
      capacity: 150,
    },
    {
      title: 'City Marathon',
      description: 'An annual marathon through the city streets.',
      category: categories[2]._id,
      date: new Date('2026-10-05'),
      city: 'Cairo',
      capacity: 500,
    },
  ]);

  console.log('Database seeded successfully.');
  console.log(`Admin login -> email: ${admin.email} | password: admin123`);

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
