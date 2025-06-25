const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const path = require('path');
const fs = require('fs');


//GET: list all pdf notes
router.get('/', fetchUser, (req, res) => {
    const notesDir = path.join(__dirname, '../uploads');

     fs.readdir(notesDir, (err, files) => {
        if (err) {
            console.error("Error reading uploads folder", err);
            return res.status(500).json({ msg: 'Unable to fetch notes' });
        }

        // Filter only .pdf files
        const pdfFiles = files.filter(file => file.endsWith('.pdf'));

        // Return as downloadable/viewable URLs
        const fileLinks = pdfFiles.map(file => ({
            filename: file,
            url: `/uploads/${file}`
        }));

        res.json(fileLinks);

    });

});

module.exports = router;
