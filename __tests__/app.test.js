const app = require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/');


beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api/topics', () => {
    test.only('GET:200 responds with a body with an array of topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            expect(body.topics).toHaveLength(3)
            body.topics.forEach((topic) => {
                expect(typeof topic.description).toBe('string')
                expect(typeof topic.slug).toBe('string')
            })
        })
    })
    test.only('GET:404 when endpoint does not exist', () => {
        return request(app)
        .get('/api/not-a-route')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Route Not Found')
        })
    })
})