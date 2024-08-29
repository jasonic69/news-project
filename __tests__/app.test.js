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
            expect(body.article.title).toBe('Living in the shadow of a great man')
            expect(body.article.author).toBe('butter_bridge')
            expect(body.article.body).toBe('I find this existence challenging')
            expect(body.article.topic).toBe('mitch')
            expect(body.article.created_at).toBe('2020-07-09T20:11:00.000Z')
            expect(body.article.votes).toBe(100)
            expect(body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')              
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

describe('/api/articles/:article_id/comments', () => {
    test('GET:200 responds with an array of comments objects', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(11)
            const commentFormat = expect.objectContaining({
                comment_id: expect.any(Number),
                article_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
            })
            body.comments.forEach((comment) => {
                expect(comment).toEqual(commentFormat);
            })
        })
    })
    test('GET:200 comments are ordered by date by default and in descending order', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toBeSortedBy('created_at', {descending: true})
        })
    })
    test('GET:404 sends an appropriate status and error message when given an id that has no comments', () => {
        return request(app)
        .get('/api/articles/8/comments')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('no comments found');
        });
    });
})

describe('POST /api/articles/:article_id/comments', () => {
    test('POST:201 responds with an object of the posted comment ', () => {
        const postComment = {
            username: 'lurker',
            body: 'this is body text'
          };
        return request(app)
        .post('/api/articles/1/comments')
        .send(postComment)
        .expect(201)
        .then(({body}) => {
            expect(body.comment.comment_id).toBe(19);
            expect(body.comment.body).toBe('this is body text');
            expect(body.comment.article_id).toBe(1);
            expect(body.comment.author).toBe('lurker');
            expect(body.comment.votes).toBe(0);
        })
    })
    test('POST:400 sends an appropriate status and error message when username dosent exist', () => {
        const postComment = {
            username: 'not-a-valid-user',
            body: 'this is body text'
          };
        return request(app)
        .post('/api/articles/1/comments')
        .send(postComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
})

describe('PATCH /api/articles/:article_id', () => {
    test('PATCH:200 responds with an object of the patched article ', () => {
        const patchRequest = { inc_votes : -100};
        return request(app)
        .patch('/api/articles/1')
        .send(patchRequest)
        .expect(200)
        .then(({body}) => {
            expect(body.article.article_id).toBe(1);
            expect(body.article.title).toBe('Living in the shadow of a great man');
            expect(body.article.topic).toBe('mitch');
            expect(body.article.author).toBe('butter_bridge');
            expect(body.article.body).toBe('I find this existence challenging');
            expect(typeof body.article.created_at).toBe('string');
            expect(body.article.votes).toBe(0);
            expect(body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
        })
    })
    test('PATCH:400 sends an appropriate status and error message when given an invalid request', () => {
        const patchRequest = { inc_votes : 'text'};
        return request(app)
        .patch('/api/articles/1')
        .send(patchRequest)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
    test('PATCH:400 sends an appropriate status and error message when given an invalid id', () => {
        const patchRequest = { inc_votes : -100};
        return request(app)
        .patch('/api/articles/not-a-number')
        .send(patchRequest)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
    test('PATCH:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        const patchRequest = { inc_votes : -100};
        return request(app)
        .patch('/api/articles/999')
        .send(patchRequest)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('article does not exist');
        });
    });
})

describe('DELETE /api/comments/:comment_id', () => {
    test('DELETE:204 when comment deleted responds with status code only - no body', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then((response) => {
            expect(response.body).toEqual({})
        })
    })
    test('DELETE:404 sends an appropriate status and error message when given a valid id that doesnt exist', () => {
        return request(app)
        .delete('/api/comments/999')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('comment does not exist');
        })
    })
    test('DELETE:400 sends an appropriate status and error message when given invalid id', () => {
        return request(app)
        .delete('/api/comments/banana')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        })
    })
})

describe('/api/users', () => {
    test('GET:200 responds with an array of user objects', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            expect(body.users).toHaveLength(4)
            const usersFormat = expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
            })
            body.users.forEach((user) => {
                expect(user).toEqual(usersFormat);
            })
        })
    })
})