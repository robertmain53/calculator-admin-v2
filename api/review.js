const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const router = express.Router();

const MD_DIR = path.join(__dirname, '..', 'content');
const COMPONENT_DIR = path.join(__dirname, '..', 'components');

// Basic markdown frontmatter validator
function validateFrontmatter(data) {
  const required = ['title', 'description', 'category', 'language'];
  const missing = required.filter(key => !data[key]);
  return missing.length ? `Missing fields: ${missing.join(', ')}` : 'Passed';
}

// Stubbed linters (to be replaced with real tools)
function runMarkdownLint(content) {
  return content.includes('##') ? 'Passed' : 'No headers found';
}
function runComponentLint(content) {
  return content.includes('<template>') ? 'Passed' : 'No template found';
}

router.post('/', async (req, res) => {
  const { slug, lang } = req.body;
  const calculatorId = `${slug}.${lang}`;

  const mdFile = path.join(MD_DIR, `${calculatorId}.md`);
  const vueFile = path.join(COMPONENT_DIR, `${slug}.vue`);

  const actions = [];

  try {
    const mdContent = await fs.readFile(mdFile, 'utf-8');
    const parsed = matter(mdContent);
    const frontmatterResult = validateFrontmatter(parsed.data);
    actions.push(`Validated frontmatter: ${frontmatterResult}`);

    const mdLintResult = runMarkdownLint(parsed.content);
    actions.push(`Ran Markdown Linter: ${mdLintResult}`);

    const vueContent = await fs.readFile(vueFile, 'utf-8');
    const vueLintResult = runComponentLint(vueContent);
    actions.push(`Ran Vue Linter: ${vueLintResult}`);

    const seoCheck = parsed.data.description.length > 40 ? 'Passed' : 'Too short';
    actions.push(`Ran SEO Check: ${seoCheck}`);

    const a11yCheck = vueContent.includes('aria-') ? 'Passed' : 'Missing A11y tags';
    actions.push(`Ran A11y Check: ${a11yCheck}`);

    const log = req.app.locals.logAction(calculatorId, 'Review completed', actions);
    res.json({ log });
  } catch (err) {
    const errorMsg = `Review failed: ${err.message}`;
    const log = req.app.locals.logAction(calculatorId, 'Review failed', [errorMsg], 'failed');
    res.status(500).json({ error: errorMsg, log });
  }
});

module.exports = router;