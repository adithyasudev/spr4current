import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { config } from 'dotenv';
import './database.js';  // Import database connection and models
import { log } from './logger.js';  // Import logging function
import routes from './routes.js';  // Import routes
import './cronjobs.js';  // Import and initialize cron jobs



config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const server = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/access.log'), { flags: 'a' });
server.use(morgan('combined', { stream: accessLogStream }));

server.use('/', routes);  // Use imported routes

server.listen(PORT, () => {
  log('info', `Server is running on port ${PORT}`);
});

export default server;
