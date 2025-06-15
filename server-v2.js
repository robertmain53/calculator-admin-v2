const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(bodyParser.json());
app.use(express.static('.'));

const LOG_FOLDER = path.join(__dirname, 'logs');
fs.ensureDirSync(LOG_FOLDER);

// Central logging utility
function logAction(calculator, event, actions, status = 'completed') {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    actions,
    status,
    calculator,
  };
  const logFile = path.join(LOG_FOLDER, `${calculator.replace(/\W+/g, '_')}.log.json`);
  fs.ensureFileSync(logFile);
  const logs = fs.existsSync(logFile) ? fs.readJsonSync(logFile) : [];
  logs.push(logEntry);
  fs.writeJsonSync(logFile, logs, { spaces: 2 });
  return logEntry;
}

// Make logger available to all routers via app.locals
app.locals.logAction = logAction;

// Modular routes
app.use('/review', require('./api/review'));
app.use('/improve', require('./api/improve'));
app.use('/approve', require('./api/approve'));
app.use('/publish', require('./api/publish'));
app.use('/rollback', require('./api/rollback'));
app.use('/logs', require('./api/logs'));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Admin API Server running on http://localhost:${PORT}`);
});