const express = require('express');
const path = require('path');
const fs = require('fs');

let notes = require('./db/db.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    let newId = notes.length;

    newNote['id'] = newId.toString();
    newId++;
    notes.push(newNote);

    fs.writeFile('db/db.json', JSON.stringify(notes), err => {
        if (err) { console.log(err) };
        console.log('Successfully saved.')
    });

    return res.status(200).end();
});

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.listen(PORT, () => console.log(`App listening on: http://localhost:${PORT}`));
