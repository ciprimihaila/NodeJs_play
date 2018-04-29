const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const jwt = require('jsonwebtoken');

const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'test@user1.com',
    password: 'user1Pass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]

}, {
    _id: userTwoId,
    email: 'test@user2.com',
    password: 'user2Pass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}]

const todos = [{
    _id: new ObjectID(),
    text: 'first todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'another todo',
    _creator: userTwoId
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);        
    }).then(() => done())
    .catch((e) => done(e));
}

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        
        return Promise.all([userOne, userTwo]);
    }).then(() => done())
}

module.exports = {todos, populateTodos, users, populateUsers};