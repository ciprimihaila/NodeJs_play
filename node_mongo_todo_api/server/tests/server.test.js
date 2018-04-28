const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

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

describe('DELETE /todos/:id', () => {
    it('test delete todo by id', (done) => {
        var testId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${testId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(testId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(testId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => {return done(e)});

            });
    })

    it('test delete todo by invalid id', (done) => {
        request(app)
            .delete('/todos/123asdad')
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('invalid id');
            })
            .end(done);
    })

    it('test delete todo by id not found', (done) => {
        var testId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${testId}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('not found');
            })
            .end(done);
    })
});

describe('PATCH /todos/:id', () => {
    it('test update todo when completed', (done) => {
        var testId = todos[0]._id.toHexString();
        var text = "test text"
        request(app)
            .patch(`/todos/${testId}`)
            .send({
                "text" : text,
                "completed" : true
            })
            .expect(200)
            .expect((res) => {
                var todo = res.body.todo;
                expect(todo).toInclude({
                    text: text,
                    completed: true
                });
                expect(todo.completedAt).toBeA('number');
            })
            .end(done);

    })

    it('test update todo when not completed', (done) => {
        var testId = todos[1]._id.toHexString();
        var text = "test text"
        request(app)
            .patch(`/todos/${testId}`)
            .send({
                "text" : text,
                "completed" : false
            })
            .expect(200)
            .expect((res) => {
                var todo = res.body.todo;
                expect(todo).toInclude({
                    text: text,
                    completed: false
                });
                expect(todo.completedAt).toNotExist();
            })
            .end(done);
    })

})

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    })

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body.error).toBe('not authenticated');
            })
            .end(done);
    })
})

describe('POST /users', () => {
    it ('should create a user', (done) => {
        var email = "testcreateuser@email.com";
        var password = "testcreateuserpass";

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e));
            })
    })

    it ('should return validation error if request invalid', (done) => {
        var email = "1123133";
        var password = "123";
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    })

    it ('should not create user if email in user', (done) => {
        request(app)
            .post('/users')
            .send({
                "email": users[0].email, 
                "password": users[0].password
            })
            .expect(400)
            .end(done);
    })
})

describe('POST /users/login', () => {
    it ('user login successfully', (done) => {
        request(app)
            .post('/users/login')
            .send({
                "email": users[1].email,
                "password": users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(users[1].email);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                
                User.findById(users[1]._id).then((user) =>{
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    })
                    done();
                }).catch((e) => done(e));
            });

    });

    it ('user login rejected', (done) => {
        request(app)
            .post('/users/login')
            .send({
                "email": users[1].email,
                "password": users[1].password + 'asd'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                
                User.findById(users[1]._id).then((user) =>{
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            })
    });
})