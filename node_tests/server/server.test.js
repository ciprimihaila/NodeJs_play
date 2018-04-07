var app = require('./server').app;

const request = require('supertest');
const expect = require('expect');

describe("Server", () => {
    it('test express get /', (done) => {
        request(app)
            .get('/')
            .expect(404)
            .expect((res) => {
                expect(res.body).toInclude({
                    error: 'Page not found'
                })
            })
            .end(done);
    })

    it('test express get /users', (done) => {
        request(app)
            .get('/users')
            .expect(200)
            .expect((res) => {
                expect(res.body).toInclude({
                    name: 'user1',
                    age: 19
                })
            })
            .end(done);
    })
})

