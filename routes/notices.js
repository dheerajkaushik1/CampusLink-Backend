const express = require('express');
const router = express.Router();
const Notice = require('../models/Notices');
const upload = require('../middleware/upload');
const fetchUser = require('../middleware/fetchUser');

//get all notices
router.get('/', async (req, res) => {
    try {
        const notices = await Notice.find().sort({ date: -1 });
        res.json(notices);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
})

//Upload Notices
router.post('/upload', fetchUser, upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const fileUrl = `/uploads/notices/${req.file.filename}`;

    const notice = new Notice({ title, description, fileUrl });
    await notice.save();

    res.json({ msg: 'Notice uploaded successfully', notice });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/notices/:id
router.delete('/:id', fetchUser, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ msg: 'Notice not found' });

    await Notice.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Notice deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update Notice
router.put('/:id', fetchUser, async (req, res) => {
  try {
    const { title, description } = req.body;
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ msg: 'Notice not found' });
    }

    notice.title = title;
    notice.description = description;
    await notice.save();

    res.json({ msg: 'Notice updated successfully', notice });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


module.exports = router;