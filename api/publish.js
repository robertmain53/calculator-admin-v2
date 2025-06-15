const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();

const APPROVED_CONTENT_DIR = path.join(__dirname, '..', 'approved', 'content');
const APPROVED_COMPONENT_DIR = path.join(__dirname, '..', 'approved', 'components');
const CALCHUB_CONTENT_DIR = path.join(__dirname, '..', '..', 'calchub', 'content');
const CALCHUB_COMPONENT_DIR = path.join(__dirname, '..', '..', 'calchub', 'components');

router.post('/', async (req, res) => {
  const { slug, lang } = req.body;
  const calculatorId = `${slug}.${lang}`;

  const approvedMdPath = path.join(APPROVED_CONTENT_DIR, `${calculatorId}.md`);
  const approvedVuePath = path.join(APPROVED_COMPONENT_DIR, `${slug}.vue`);
  const finalMdPath = path.join(CALCHUB_CONTENT_DIR, `${calculatorId}.md`);
  const finalVuePath = path.join(CALCHUB_COMPONENT_DIR, `${slug}.vue`);

  const actions = [];

  try {
    if (!(await fs.pathExists(approvedMdPath)) || !(await fs.pathExists(approvedVuePath))) {
      throw new Error('Approved files not found');
    }

    await fs.copy(approvedMdPath, finalMdPath);
    actions.push('Published markdown to calchub');

    await fs.copy(approvedVuePath, finalVuePath);
    actions.push('Published Vue component to calchub');

    const log = req.app.locals.logAction(calculatorId, 'Publish completed', actions);
    res.json({ status: 'ok', log });
  } catch (err) {
    const errorMsg = `Publish failed: ${err.message}`;
    const log = req.app.locals.logAction(calculatorId, 'Publish failed', [errorMsg], 'failed');
    res.status(500).json({ error: errorMsg, log });
  }
});

module.exports = router;