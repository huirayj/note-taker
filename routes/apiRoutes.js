const fs = require('fs');
const notes = require('../db/db.json');

module.exports = (app) => {
    // gets all notes
    app.get('/api/notes', (req, res, next) => {
        fs.readFile('db/db.json', 'utf8', (err, data) => {
            (err) ? next(err) : res.json(JSON.parse(data));
        });
    });

    // adds notes
    app.post('/api/notes', (req, res, next) => {
        const newNote = req.body;
        let newId = notes.length;

        // gives new notes an id
        newNote['id'] = newId.toString();
        newId++;
        notes.push(newNote);

        // writes note to database
        fs.writeFile('db/db.json', JSON.stringify(notes), err => {
            (err) ? next(err) : console.log('Successfully saved.');
        });

        return res.status(200).end();
    });

    // deletes a specific note
    app.delete('/api/notes/:id', (req, res, next) => {
        const id = req.params.id;

        fs.readFile('db/db.json', 'utf8', (err, data) => {
            // returns non-deleted notes
            const updatedNotes = JSON.parse(data).filter(note => note.id !== id);
            let updatedId = 0;

            // gives each note a new id
            updatedNotes.map(note => {
                note.id = updatedId.toString();
                updatedId++;
            });

            // writes note to database
            fs.writeFile('db/db.json', JSON.stringify(updatedNotes), (err) => {
                if (err) {
                    next(err);
                } else {
                    console.log('Successfully deleted');
                    res.json(updatedNotes);
                }
            });
        });
    });
};
