const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();

const LOG_FOLDER = path.join(__dirname, '..', 'logs');

router.get('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug.replace(/\W+/g, '_');
    const logFile = path.join(LOG_FOLDER, `${slug}.log.json`);
    if (!(await fs.pathExists(logFile))) {
      return res.status(404).json({ error: 'Logs not found for calculator' });
    }
    const logs = await fs.readJson(logFile);
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;