const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();

const IMPROVED_CONTENT_DIR = path.join(__dirname, '..', 'content-improved');
const IMPROVED_COMPONENT_DIR = path.join(__dirname, '..', 'components-improved');
const APPROVED_CONTENT_DIR = path.join(__dirname, '..', 'approved', 'content');
const APPROVED_COMPONENT_DIR = path.join(__dirname, '..', 'approved', 'components');

fs.ensureDirSync(APPROVED_CONTENT_DIR);
fs.ensureDirSync(APPROVED_COMPONENT_DIR);

router.post('/', async (req, res) => {
  const { slug, lang } = req.body;
  const calculatorId = `${slug}.${lang}`;

  const improvedMdPath = path.join(IMPROVED_CONTENT_DIR, `${calculatorId}.md`);
  const improvedVuePath = path.join(IMPROVED_COMPONENT_DIR, `${slug}.vue`);
  const approvedMdPath = path.join(APPROVED_CONTENT_DIR, `${calculatorId}.md`);
  const approvedVuePath = path.join(APPROVED_COMPONENT_DIR, `${slug}.vue`);

  const actions = [];

  try {
    if (!(await fs.pathExists(improvedMdPath)) || !(await fs.pathExists(improvedVuePath))) {
      throw new Error('Improved files not found');
    }

    await fs.copy(improvedMdPath, approvedMdPath);
    actions.push('Approved markdown content');

    await fs.copy(improvedVuePath, approvedVuePath);
    actions.push('Approved Vue component');

    const log = req.app.locals.logAction(calculatorId, 'Approval completed', actions);
    res.json({ status: 'ok', log });
  } catch (err) {
    const errorMsg = `Approval failed: ${err.message}`;
    const log = req.app.locals.logAction(calculatorId, 'Approval failed', [errorMsg], 'failed');
    res.status(500).json({ error: errorMsg, log });
  }
});

module.exports = router;