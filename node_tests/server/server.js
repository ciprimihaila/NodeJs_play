var express = require('express');

var app = express();

app.get('/', (req, res) => {
    res.status(404).send({
       name: 'test app',
       error: 'Page not found' 
    });
});

app.get('/users', (req, res) => {
    res.send([{
        name: 'user1',
        age: 19  
    }, 
    {
        name: 'user2',
        age: 20
    }]);
})

app.listen(3000);
module.exports.app = app;