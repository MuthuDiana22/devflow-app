const request = require('supertest');
const app = require('./server'); // Importing our app

describe('DevFlow API Tests', () => {
    
    // Test 1: Check if the GET /api/tasks endpoint is working
    it('should fetch all tasks', async () => {
        const res = await request(app).get('/api/tasks');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test 2: Check if a new task can be created (Automated Sanity Testing)
    it('should create a new task', async () => {
        const res = await request(app).post('/api/tasks').send({
            title: 'Test Task from Jest'
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('title', 'Test Task from Jest');
    });

    // Test 3: Should NOT create a task without a title (Error handling)
    it('should NOT create a task without a title', async () => {
        const res = await request(app).post('/api/tasks').send({});
        expect(res.statusCode).toEqual(400);
    });
});