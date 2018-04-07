var utils = require('./utils');

var expect = require('expect');

it("test add 2 numbers", () => {
    var res = utils.add(3,2);
    
    expect(res).toBe(5).toBeA('number');
});

it("test square number", () => {
    var res = utils.square(5);
    
    expect(res).toBe(25).toBeA('number');
});

it("test set Name", () => {
    var user = {
        age: 10,
        location: "test"
    };
    var resUser = utils.setName(user, "name surname");

    expect(resUser).toInclude({
        firstName: "name",
        lastName: "surname"
    });
    
});

it("test add asynchronously", (done) => {
    utils.asyncAdd(1, 2, (sum) => {
        expect(sum).toBeA('number').toBe(3);
        done();
    })
})

it("test expect capabilities", () => {
    expect(24).toNotBe(44);
    expect({name: "test"}).toEqual({name: "test"});
    expect([1, 2, 3]).toExclude(4);
    expect({
        prop1: "test1",
        prop2: "test2"
    }).toInclude({
        prop1: "test1"
    });
});