const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Doubt = require('../models/Doubt');

// 📌 POST: Add a doubt
router.post('/', fetchUser, async (req, res) => {
  try {
    const { title, description, year } = req.body;
    const doubt = new Doubt({
      user: req.user.id,
      name: req.user.name,
      title,
      description,
      year,
    });

    const saved = await doubt.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 📌 GET: Get all doubts
router.get('/', fetchUser, async (req, res) => {
  try {
    const doubts = await Doubt.find().sort({ createdAt: -1 });
    res.json(doubts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 📌 GET: Get a single doubt with answers
router.get('/:id', fetchUser, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ error: 'Doubt not found' });
    res.json(doubt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 📌 POST: Add an answer to a doubt
router.post('/:id/answer', fetchUser, async (req, res) => {
  try {
    const { text } = req.body;
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ error: 'Doubt not found' });

    const answer = {
      user: req.user.id,
      name: req.user.name,
      text,
      createdAt: new Date()
    };

    doubt.answers.push(answer);
    await doubt.save();
    res.json(doubt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 📌 DELETE: Delete an answer from a doubt
router.delete('/:doubtId/answer/:answerId', fetchUser, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.doubtId);
    if (!doubt) return res.status(404).json({ error: 'Doubt not found' });

    const answer = doubt.answers.id(req.params.answerId);
    if (!answer) return res.status(404).json({ error: 'Answer not found' });

    if (!answer.user || String(answer.user) !== req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    doubt.answers.pull(answer._id);
    await doubt.save();

    const updatedDoubt = await Doubt.findById(req.params.doubtId);
    res.json({ msg: 'Answer deleted', doubt: updatedDoubt });
  } catch (err) {
    console.error('❌ Delete answer error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 📌 PUT: Edit a doubt
router.put('/:id', fetchUser, async (req, res) => {
  try {
    const { title, description } = req.body;
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ error: 'Doubt not found' });
    if (doubt.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    doubt.title = title || doubt.title;
    doubt.description = description || doubt.description;
    await doubt.save();
    res.json(doubt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 📌 DELETE: Delete a doubt
router.delete('/:id', fetchUser, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ error: 'Doubt not found' });
    if (doubt.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await Doubt.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Doubt deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 📌 PATCH: Mark as resolved
router.patch('/:id/resolve', fetchUser, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ error: 'Doubt not found' });

    if (doubt.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    doubt.resolved = true;
    await doubt.save();
    res.json({ msg: 'Marked as resolved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
