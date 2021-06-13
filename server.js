const express = require('express');
const path = require('path');
const fs = require('fs');

let notes = require('./db/db.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

app.get('/api/notes', (req, res, next) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        (err) ? next(err) : res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res, next) => {
    const newNote = req.body;
    let newId = notes.length;

    newNote['id'] = newId.toString();
    newId++;
    notes.push(newNote);

    fs.writeFile('db/db.json', JSON.stringify(notes), err => {
        (err) ? next(err) : console.log('Successfully saved.');
    });

    return res.status(200).end();
});

app.delete('/api/notes/:id', (req, res, next) => {
    const id = req.params.id;

    fs.readFile('db/db.json', 'utf8', (err, data) => {
        let updatedId = 0;
        let updatedNotes = JSON.parse(data).filter(note => note.id !== id);

        updatedNotes.map(note => {
            note.id = updatedId.toString();
            updatedId++;
        });

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

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.listen(PORT, () => console.log(`App listening on: http://localhost:${PORT}`));
