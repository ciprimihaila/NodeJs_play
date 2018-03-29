const yargs = require('yargs');
const geocode = require('./geocode.js');

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

geocode.fetchGeocode(argv.address, (errorMessage, results) => {
    if (errorMessage) {
        console.log(errorMessage);
    } else {
        console.log(JSON.stringify(results, undefined, 2));
    }
});