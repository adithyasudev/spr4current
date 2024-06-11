import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from './logger.js';
import { Entry } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processChunks(dataArray, chunkSize) {
  for (let i = 0; i < dataArray.length; i += chunkSize) {
    const chunk = dataArray.slice(i, i + chunkSize);
    log('info', `Processing chunk: ${i / chunkSize + 1} / ${Math.ceil(dataArray.length / chunkSize)}`);

    const promises = chunk.map(async (data) => {
      try {
        const existingEntry = await Entry.findOne({ id: data.id });
        if (!existingEntry) {
          await Entry.create(data);
          log('success', `New entry added: ${JSON.stringify(data)}`);
        } else {
          await Entry.updateOne({ id: data.id }, data);
          log('success', `Existing entry updated: ${JSON.stringify(data)}`);
        }
      } catch (error) {
        log('error', `Error processing data: ${JSON.stringify(data)}, Error: ${error}`);
      }
    });

    await Promise.all(promises);
  }
}

export async function readFileAndUpload() {
  const filePath = path.join(__dirname, './data.json');
  if (!fs.existsSync(filePath)) {
    log('error', `Data file not found: ${filePath}`);
    return;
  }

  let rawData;
  try {
    rawData = fs.readFileSync(filePath, 'utf-8');
    log('info', `Read data from file: ${filePath}`);
  } catch (error) {
    log('error', `Failed to read file: ${filePath}, Error: ${error}`);
    return;
  }

  let dataArray;
  try {
    dataArray = JSON.parse(rawData);
    log('info', `Parsed data successfully from file: ${filePath}`);
  } catch (error) {
    log('error', `Failed to parse data from file: ${filePath}, Error: ${error}`);
    return;
  }

  await processChunks(dataArray, 10); 
}
