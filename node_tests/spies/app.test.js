const expect = require('expect');
const rewire = require('rewire');

var app = rewire('./app');

describe('App test using Spy', () => {

    var db = {
        saveUser: expect.createSpy()
    }
    app.__set__('db', db);

    it('test call of saveUser with object', () => {
        var email = 'test@exampl.com';
        var password = 'test';

        app.handleSignUp(email, password);
        expect(db.saveUser).toHaveBeenCalledWith({email, password});

    })

});