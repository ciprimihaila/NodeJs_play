const request = require('request');

var fetchGeocode = (address, callback) => {
    var encodedAddress = encodeURIComponent(address);
    request({
        url: `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
        json: true
    }, (error, response, body) => {
        if (error) {
            callback('Unable to connect to server');
        } else if (body.status === 'ZERO_RESULTS') {
            callback('Unable to find that address');
        } else if (body.status === 'OK') {
            //console.log(JSON.stringify(response, undefined, 2));
            callback(undefined, {
                addresa: body.results[0].formatted_address,
                latitude: body.results[0].geometry.location.lat,
                longitude: body.results[0].geometry.location.lng
            })
        }
        
    })
}

module.exports = {
    fetchGeocode
}
