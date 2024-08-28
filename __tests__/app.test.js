const app = require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const data = require('../db/data/test-data/');


beforeEach(() => seed(data));
afterAll(() => db.end());


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

describe('/api/articles/:article_id', () => {
    test('GET:200 responds with an array of an article', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(body.article.article_id).toBe(1);
            expect(typeof body.article.title).toBe('string')
            expect(typeof body.article.article_id).toBe('number')
            expect(typeof body.article.author).toBe('string')
            expect(typeof body.article.body).toBe('string')
            expect(typeof body.article.topic).toBe('string')
            expect(typeof body.article.created_at).toBe('string')
            expect(typeof body.article.votes).toBe('number')
            expect(typeof body.article.article_img_url).toBe('string')              
        })
    })
    test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
        .get('/api/articles/not-valid-id')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    })
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('article does not exist');
        });
    });
})

describe('/api/articles', () => {
    test('GET:200 responds with an array of article objects', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(13)
            body.articles.forEach((article) => {
                expect(typeof article.title).toBe('string')
                expect(typeof article.article_id).toBe('number')
                expect(typeof article.author).toBe('string')
                expect(typeof article.topic).toBe('string')
                expect(typeof article.created_at).toBe('string')
                expect(typeof article.votes).toBe('number')
                expect(typeof article.article_img_url).toBe('string') 
                expect(typeof article.comment_count).toBe('number')               
            })
        })
    })
    test('GET:200 articles are ordered by date by default and in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
        })
    })
})