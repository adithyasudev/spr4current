import cron from 'node-cron';
import { log } from './logger.js';
import { readFileAndUpload } from './processData.js';

cron.schedule('0 0,12 * * *', () => {
  log('info', 'Running scheduled task');
  readFileAndUpload().catch(err => log('error', `Error in scheduled task: ${err}`));
});
