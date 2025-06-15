const request = require('supertest');
const express = require('express');
const reviewRoute = require('../api/review');

const app = express();
app.use(express.json());
app.locals.logAction = () => {}; // mock logger
app.use('/review', reviewRoute);

describe('POST /review', () => {
  it('should fail if file is missing', async () => {
    const res = await request(app).post('/review').send({
      slug: 'nonexistent',
      lang: 'en'
    });
    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/failed/i);
  });
});