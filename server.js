const express = require("express");
const path = require('fs');
const { v4: uuidv4 } = require('uuid'); // for each note a uniqie id 

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));

//html routes

app.get('/notes', (req,res) => {
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