const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const Category = require('../../models/Category');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Events API', () => {
  test('GET /api/events returns an empty list initially', async () => {
    const res = await request(app).get('/api/events');

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.total).toBe(0);
  });

  test('GET /api/events/:id returns 404 for a non-existent event', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/events/${fakeId}`);

    expect(res.statusCode).toBe(404);
  });

  test('POST /api/events rejects requests without a token', async () => {
    const category = await Category.create({ name: 'Tech' });

    const res = await request(app).post('/api/events').send({
      title: 'Test Event',
      description: 'A test event',
      category: category._id,
      date: '2026-12-01',
      city: 'Cairo',
      capacity: 100,
    });

    expect(res.statusCode).toBe(401);
  });
});
