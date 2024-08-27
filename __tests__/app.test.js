const app = require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/');


beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api', () => {
    test('GET:200 responds with all the api details', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            const keys = Object.keys(body.apis)
            keys.forEach(key => {
                expect(typeof body.apis[key]).toBe('object')
                expect(typeof body.apis[key].description).toBe('string')
                expect(typeof body.apis[key].queries).toBe('object')
                expect(typeof body.apis[key].exampleResponse).toBe('object')
            })
        })
    })
})

describe('/api/topics', () => {
    test('GET:200 responds with a body with an array of topics', () => {
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
})

describe('/api/not-a-route', () => {
    test('GET:404 when endpoint does not exist', () => {
        return request(app)
        .get('/api/not-a-route')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Route Not Found')
        })
    })
})