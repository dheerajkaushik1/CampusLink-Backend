// routes/notes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Note = require('../models/Note');

// Temporary storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'temp/'),  // temp folder
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post('/uploadnotes', upload.single('pdf'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const filePath = req.file.path;

    const newNote = new Note({
      title,
      description,
      pdf: {
        data: fs.readFileSync(filePath),
        contentType: req.file.mimetype,
        name: req.file.originalname
      }
    });

    await newNote.save();

    // delete file after saving to DB
    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'Note uploaded with PDF to DB' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading note');
  }
});


// GET all notes from MongoDB
router.get('/getnotes', async (req, res) => {
  try {
    const notes = await Note.find({});
    res.json(notes);
  } catch (err) {
    res.status(500).send('Error fetching notes');
  }
});

module.exports = router;