import express from 'express';
import path from 'path';
import fs from 'fs';
import { log } from './logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
  const level = req.query.level ? req.query.level.toUpperCase() : 'INFO';
  const logFilePath = path.join(__dirname, `logs/${level.toLowerCase()}.log`);
  let filteredLogs = [];

  if (fs.existsSync(logFilePath)) {
    const logFile = fs.readFileSync(logFilePath, 'utf-8');
    filteredLogs = logFile.split('\n').filter(log => log.includes(level));
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Log Dashboard</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f9fa;
          margin: 0;
          padding: 20px;
        }
        h1 {
          text-align: center;
          color: #343a40;
        }
        form {
          text-align: center;
          margin-bottom: 20px;
        }
        label {
          font-size: 1.2em;
          margin-right: 10px;
        }
        select {
          padding: 5px;
          font-size: 1em;
        }
        pre {
          background-color: #e9ecef;
          border: 1px solid #ced4da;
          border-radius: 4px;
          padding: 10px;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .log-container {
          max-width: 800px;
          margin: 0 auto;
        }
      </style>
    </head>
    <body>
      <div class="log-container">
        <h1>Log Dashboard</h1>
        <form method="get">
          <label for="level">Log Level:</label>
          <select id="level" name="level" onchange="this.form.submit()">
            <option value="INFO" ${level === 'INFO' ? 'selected' : ''}>INFO</option>
            <option value="WARN" ${level === 'WARN' ? 'selected' : ''}>WARN</option>
            <option value="ERROR" ${level === 'ERROR' ? 'selected' : ''}>ERROR</option>
            <option value="SUCCESS" ${level === 'SUCCESS' ? 'selected' : ''}>SUCCESS</option>
          </select>
        </form>
        <pre>${filteredLogs.join('\n')}</pre>
      </div>
    </body>
    </html>
  `);
});

export default router;
