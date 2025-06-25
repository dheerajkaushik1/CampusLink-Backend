const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const path = require('path');
const fs = require('fs');
router.get('/', fetchUser, (req, res) => {
  const notesDir = path.join(__dirname, '../uploads/notes');
  console.log('📁 Looking for notes in:', notesDir); // ✅ DEBUG

  fs.readdir(notesDir, (err, files) => {
    if (err) {
      console.error("❌ Error reading uploads/notes folder:", err); // ✅
      return res.status(500).json({ msg: 'Unable to fetch notes' });
    }

    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    const fileLinks = pdfFiles.map(file => ({
      filename: file,
      url: `/uploads/notes/${file}`
    }));

    res.json(fileLinks);
  });
});

module.exports = router;
