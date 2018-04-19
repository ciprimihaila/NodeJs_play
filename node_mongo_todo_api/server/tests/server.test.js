const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'first todo'
}, {
    _id: new ObjectID(),
    text: 'another todo'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);        
    }).then(() => done())
    .catch((e) => done(e));
});

describe('POST /todos', () => {
    it('create a new todo', (done) => {
        var text = 'test create todo';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => {
                    return done(e);
                })
            })
    })

    it('should not create a new todo', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(todos.length);
                    done();
                }).catch((e) => {
                    return done(e);
                })
            })
     });
})

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(todos.length);
            })
            .end(done);
    })
});

describe('GET /todos/:id', () => {
    it('test get todo by id', (done) => {
        var testId = todos[0]._id.toHexString();
        request(app)
            .get(`/todos/${testId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(testId);
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    })

    it('test get todo by invalid id', (done) => {
        request(app)
            .get('/todos/123asdad')
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('invalid id');
            })
            .end(done);
    })

    it('test get todo by id not found', (done) => {
        var testId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${testId}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('not found');
            })
            .end(done);
    })
});