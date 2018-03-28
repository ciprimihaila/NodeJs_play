console.log('Starting notes.js');
//function () --- () =>

const fs = require('fs');

var fetchNotes = () => {
    try {
        var notesString = fs.readFileSync('notes-data.json');
        return JSON.parse(notesString);
    } catch (e) {
        return [];
    }
};

var saveNotes = (notes) => {
    fs.writeFileSync('notes-data.json', JSON.stringify(notes));
};

var addNote = (title, body) => {
    var notes = fetchNotes();
    var note = {
        title,
        body
    };  
    
    var notesDuplicate = notes.filter((note) => {
        return note.title === title;
    })
    //var notesDuplicate = notes.filter((note) => note.title === title)
    
    if (notesDuplicate.length === 0) {
        notes.push(note);
        saveNotes(notes);
        return note;
    }
}

var getAll = () => {
    return fetchNotes();
}

var readNote = (title) => {
    var notes = fetchNotes();
    var filterNotes = notes.filter((note) => note.title === title);
    return filterNotes[0];
}

var removeNote = (title) => {
    var notes = fetchNotes();
    var filterNotes = notes.filter((note) => note.title !== title);
    saveNotes(filterNotes);
    return notes.length !== filterNotes.length;
}

var logNote = (note) => {
    debugger;
    console.log('Note title ' + note.title + ' body ' + note.body);
}

module.exports = {
    addNote,
    logNote,
    readNote,
    removeNote,
    getAll
}