const express = require("express");
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // for each note a uniqie id 
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//html routes

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html')); // /Users/yaseminvatan/bootcamp/homeworks/UCBhomeworks/letMeTakeYourNote/public/index.html
});



// API Routes
// get all notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to read notes' });
        } else {
            res.json(JSON.parse(data));
        }
    });
});
// save a new note
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            id: uuidv4(), // Generate unique ID
            title,
            text,
        };
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to read notes' });
            } else {
                const notes = JSON.parse(data);
                notes.push(newNote);

                fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: 'Failed to save note' });
                    } else {
                        res.json(newNote);
                    }
                });
              }
            });
          } else {
            res.status(400).json({ error: 'Please provide both a title and text' });
          }
        });
        
        app.use(express.static('public'));
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, './public/index.html'));
        });
// BONUS: DELETE /api/notes/:id - Delete a note by its ID
// DELETE route to remove a note by ID
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id; // Get the note ID from the route parameter

    // Read the existing notes from the db.json file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to read notes' });
        } else {
            let notes = JSON.parse(data); // Parse the notes as JSON
            const filteredNotes = notes.filter(note => note.id !== noteId); // Remove the note with the matching ID

            // Write the updated notes back to the db.json file
            fs.writeFile('./db/db.json', JSON.stringify(filteredNotes, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Failed to delete note' });
                } else {
                    res.json({ message: 'Note deleted successfully' }); // Respond with a success message
                }
            });
        }
    });
});


// Start the server
app.listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}`)
  );

