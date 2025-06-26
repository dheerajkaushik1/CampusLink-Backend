const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Note = require('../models/Note');
const fetchUser = require('../middleware/fetchUser');
const isAdmin = require('../middleware/isAdmin');

// Ensure temp folder exists
const tempDir = path.join(__dirname, '..', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
  console.log('📁 Created temp directory');
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


// ✅ Upload note (Admin only)
router.post('/uploadnotes', fetchUser, isAdmin, upload.single('pdf'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const filePath = req.file?.path;

    if (!filePath) return res.status(400).json({ message: 'No PDF file uploaded' });

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

    res.status(200).json({ message: '✅ Note uploaded with PDF to DB' });
  } catch (err) {
    console.error('❌ Upload failed:', err);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// ✅ Public: Get all notes
router.get('/getnotes', async (req, res) => {
  try {
    const notes = await Note.find({});
    res.json(notes);
  } catch (err) {
    console.error('❌ Fetch notes error:', err);
    res.status(500).send('Error fetching notes');
  }
});

// ✅ Delete note (Admin only)
router.delete('/deletenote/:id', fetchUser, isAdmin, async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    res.json({ message: '🗑️ Note deleted successfully' });
  } catch (err) {
    console.error('❌ Delete note error:', err);
    res.status(500).json({ message: 'Server error while deleting note' });
  }
});

// ✅ Edit note (Admin only)
router.put('/editnote/:id', fetchUser, isAdmin, async (req, res) => {
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
