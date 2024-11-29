const express = require("express");
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // for unique IDs
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Correctly serve static files from the "public" folder

// HTML Routes
app.get('/notes', (req, res) => {
    // FIX: Corrected the path to "notes.html"
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// API Routes

// GET all notes
app.get('/api/notes', (req, res) => {
    // FIX: Corrected the path to "db.json" and added error logging
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading db.json:', err);
            res.status(500).json({ error: 'Failed to read notes' });
        } else {
            console.log("JSON.parse(data) is working")
            res.json(JSON.parse(data));
          
        }
    });
});

// POST a new note
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            id: uuidv4(), // Generate unique ID
            title,
            text,
        };

        // Read the existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading db.json:', err);
                res.status(500).json({ error: 'Failed to read notes' });
            } else {
                const notes = JSON.parse(data);
                notes.push(newNote); // Add new note

                // Write updated notes back to the file
                fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing to db.json:', err);
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

// DELETE a note by ID
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    // Read the existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading db.json:', err);
            res.status(500).json({ error: 'Failed to read notes' });
        } else {
            const notes = JSON.parse(data);
            const filteredNotes = notes.filter(note => note.id !== noteId); // Filter out the note with the given ID

            // Write updated notes back to the file
            fs.writeFile('./db/db.json', JSON.stringify(filteredNotes, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to db.json:', err);
                    res.status(500).json({ error: 'Failed to delete note' });
                } else {
                    res.json({ message: 'Note deleted successfully' });
                }
            });
        }
    });
});

// Fallback Route (for all unmatched routes)
app.get('*', (req, res) => {
    // FIX: Corrected path to "index.html"
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
