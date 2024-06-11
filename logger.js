import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

export function log(level, message) {
  const logMessage = `${new Date().toISOString()} [${level.toUpperCase()}] - ${message}\n`;
  fs.appendFileSync(path.join(__dirname, `logs/${level.toLowerCase()}.log`), logMessage);
  console.log(logMessage);
}
