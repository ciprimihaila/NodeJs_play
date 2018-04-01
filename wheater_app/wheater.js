const request = require('request');

var getWheater = (lat, lng, callback) => {
    
    request({
        url: `https://api.darksky.net/forecast/2f1009f59bce3889b0e10ee5782f5575/${lat},${lng}`,
        json: true
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            callback(undefined, {
                temperature: body.currently.temperature,
                apparentTemperature: body.currently.apparentTemperature
            });
        } else {
            callback('Unable to fetch wheather');
        }      
    });
}

module.exports = {
    getWheater
}
   

