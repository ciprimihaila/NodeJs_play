const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
    .options({
        address: {
            demand: true,
            alias: 'a',
            describe: 'Address to fetch wheather for',
            string: true
        }
    })
    .help()
    .argv

var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl).then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
        throw new Error("No results")
    }

    var location = response.data.results[0].geometry.location;
    var wheaterUrl =  `https://api.darksky.net/forecast/2f1009f59bce3889b0e10ee5782f5575/${location.lat},${location.lng}`;
     
    console.log(response.data.results[0].formatted_address);
    
    return axios.get(wheaterUrl);
}).then((response) => {
    var currently = response.data.currently;
    console.log('Current temperature ' + currently.temperature);
    console.log('Feel temperature ' + currently.apparentTemperature);
}).catch((ex) => {
    if (ex.code === 'ENOTFOUND') {
        console.log("unable to connect to server");
    } else {
        console.log(ex.message);
    }
})

 