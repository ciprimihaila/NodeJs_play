console.log('Starting app.js');

const fs = require('fs');
const os = require('os');
const notes = require('./notes.js');
const _ = require('lodash');
const yargs = require('yargs');

const titleOptions = {
    describe: 'Title of note',
    demand: true,
    alias: 't'
}

const argv = yargs
    .command('add', 'Add a new note', {
        title: titleOptions,
        body: {
            describe: 'Body of note',
            demand: true,
            alias: 'b'
        }
    })
    .command('list', 'List all notes')
    .command('read', 'Read node', {
        title: titleOptions})
    .command('remove', 'Remove node', {
        title: titleOptions})
    .help()        
    .argv;

var command = argv._[0];//process.argv[2];
console.log('process: ', process.argv);
console.log('yargs: ', argv);

if (command ==='add') {
    var note = notes.addNote(argv.title, argv.body);
    if (_.isUndefined(note)) {
        console.log('Note already exists')
    } else {
        notes.logNote(note);
    }
} else if (command === 'list') {
    var allNotes = notes.getAll();
    console.log(`All notes: ${allNotes.length} notes`);
    allNotes.forEach((note) => {
        notes.logNote(note);
    })
} else if (command === 'read') {
    var note = notes.readNote(argv.title)
    if (!_.isUndefined(note)) {
        notes.logNote(note);
    } else {
        console.log('Note not found');
    }
} else if (command === 'remove') {
    var removed = notes.removeNote(argv.title)
    if (removed) {
        console.log('Note removed');
    } else {
        console.log('Note not removed');
    }
} else {
    console.log('Not recognized');
}
 
