const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();

const APPROVED_CONTENT_DIR = path.join(__dirname, '..', 'approved', 'content');
const APPROVED_COMPONENT_DIR = path.join(__dirname, '..', 'approved', 'components');
const CALCHUB_PATH = path.join(__dirname, '..', 'calchub');
const CALCHUB_CONTENT_DIR = path.join(CALCHUB_PATH, 'content');
const CALCHUB_COMPONENT_DIR = path.join(CALCHUB_PATH, 'components');

router.post('/', async (req, res) => {
  const { slug, lang } = req.body;
  const calculatorId = `${slug}.${lang}`;

  const approvedMdPath = path.join(APPROVED_CONTENT_DIR, `${calculatorId}.md`);
  const approvedVuePath = path.join(APPROVED_COMPONENT_DIR, `${slug}.vue`);
  const publishMdPath = path.join(CALCHUB_CONTENT_DIR, `${calculatorId}.md`);
  const publishVuePath = path.join(CALCHUB_COMPONENT_DIR, `${slug}.vue`);

  const actions = [];

  try {
    if (!(await fs.pathExists(approvedMdPath)) || !(await fs.pathExists(approvedVuePath))) {
      throw new Error('Approved files not found for rollback');
    }

    // Restore approved version to calchub
    await fs.copy(approvedMdPath, publishMdPath);
    actions.push('Rolled back markdown to approved version');

    await fs.copy(approvedVuePath, publishVuePath);
    actions.push('Rolled back component to approved version');

    const log = req.app.locals.logAction(calculatorId, 'Rollback completed', actions);
    res.json({ status: 'ok', log });
  } catch (err) {
    const errorMsg = `Rollback failed: ${err.message}`;
    const log = req.app.locals.logAction(calculatorId, 'Rollback failed', [errorMsg], 'failed');
    res.status(500).json({ error: errorMsg, log });
  }
});

module.exports = router;