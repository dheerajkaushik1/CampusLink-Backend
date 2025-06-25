const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Note = require('../models/Note');

// Ensure temp folder exists
const tempDir = path.join(__dirname, '..', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
  console.log('📁 Created temp directory');
}

// Temporary storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/uploadnotes', upload.single('pdf'), async (req, res) => {
  try {
    console.log('📥 Incoming upload request');
    console.log('📝 Body:', req.body);
    console.log('📄 File:', req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

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
    fs.unlinkSync(filePath); // cleanup

    console.log('✅ Note saved successfully');
    res.status(200).json({ message: '✅ Note uploaded with PDF to DB' });
  } catch (err) {
    console.error('❌ Upload failed:', err);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

router.get('/getnotes', async (req, res) => {
  try {
    const notes = await Note.find({});
    res.json(notes);
  } catch (err) {
    console.error('❌ Fetch notes error:', err);
    res.status(500).send('Error fetching notes');
  }
});

//delete a note
router.delete('/deletenote/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    res.json({ message: '🗑️ Note deleted successfully' });
  } catch (err) {
    console.error('❌ Delete note error:', err);
    res.status(500).json({ message: 'Server error while deleting note' });
  }
});


//edit a note
router.put('/editnote/:id', async (req, res) => {
  try {
    const { title, description } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );

    if (!updatedNote) return res.status(404).json({ message: 'Note not found' });

    res.json({ message: '✏️ Note updated successfully', updatedNote });
  } catch (err) {
    console.error('❌ Edit note error:', err);
    res.status(500).json({ message: 'Server error while editing note' });
  }
});


module.exports = router;
