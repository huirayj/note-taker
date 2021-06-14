const path = require('path');

module.exports = (app) => {
    // route to notes 
    app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '../public/notes.html')));
    // route to index
    app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
};