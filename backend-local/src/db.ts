
import { fileURLToPath } from 'url';
import path from 'path';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);     // src 目录

const db = new Database(path.join(__dirname, '../data/assets.db'));
export default db;



