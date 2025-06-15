const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');

const router = express.Router();

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const COMPONENT_DIR = path.join(__dirname, '..', 'components');
const IMPROVED_CONTENT_DIR = path.join(__dirname, '..', 'content-improved');
const IMPROVED_COMPONENT_DIR = path.join(__dirname, '..', 'components-improved');

fs.ensureDirSync(IMPROVED_CONTENT_DIR);
fs.ensureDirSync(IMPROVED_COMPONENT_DIR);

// Mock AI improvement function
function improveMarkdown(content) {
  return content.replace(/\n##/g, '\n\n##') + '\n\n<!-- Improved for clarity -->';
}
function improveComponent(content) {
  return content.replace('<template>', '<template>\n  <!-- Improved accessibility -->');
}

router.post('/', async (req, res) => {
  const { slug, lang } = req.body;
  const calculatorId = `${slug}.${lang}`;

  const mdPath = path.join(CONTENT_DIR, `${calculatorId}.md`);
  const vuePath = path.join(COMPONENT_DIR, `${slug}.vue`);
  const improvedMdPath = path.join(IMPROVED_CONTENT_DIR, `${calculatorId}.md`);
  const improvedVuePath = path.join(IMPROVED_COMPONENT_DIR, `${slug}.vue`);

  const actions = [];

  try {
    const originalMd = await fs.readFile(mdPath, 'utf-8');
    const improvedMd = improveMarkdown(originalMd);
    await fs.writeFile(improvedMdPath, improvedMd, 'utf-8');
    actions.push('Improved markdown content');

    const originalVue = await fs.readFile(vuePath, 'utf-8');
    const improvedVue = improveComponent(originalVue);
    await fs.writeFile(improvedVuePath, improvedVue, 'utf-8');
    actions.push('Improved Vue component');

    const log = req.app.locals.logAction(calculatorId, 'Improvement completed', actions);
    res.json({ status: 'ok', log });
  } catch (err) {
    const errorMsg = `Improvement failed: ${err.message}`;
    const log = req.app.locals.logAction(calculatorId, 'Improvement failed', [errorMsg], 'failed');
    res.status(500).json({ error: errorMsg, log });
  }
});

module.exports = router;