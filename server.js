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