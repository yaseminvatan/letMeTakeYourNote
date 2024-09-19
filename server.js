const express = require("express");
const path = require('fs');
const { v4: uuidv4 } = require('uuid'); // for each note a uniqie id 

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//html routes

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// API Routes

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
    
// BONUS: DELETE /api/notes/:id - Delete a note by its ID

// Start the server
app.listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}`)
  );

