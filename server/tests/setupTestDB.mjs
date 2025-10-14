import fs from 'fs';
import sqlite from 'sqlite3';
import path from 'path';

const DB_PATH = path.resolve('./db/OfficeQueue.sqlite');

// Remove existing DB so tests start from a clean state
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  console.log('Removed existing test DB at', DB_PATH);
}

const db = new sqlite.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to create test DB:', err);
    process.exit(1);
  }
});

db.serialize(() => {
  // Create Services table (used as Services / services by dao.mjs)
  db.run(`CREATE TABLE Services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    servicetime INTEGER DEFAULT 0,
    count INTEGER DEFAULT 0
  )`);

  // Create Tickets table
  db.run(`CREATE TABLE Tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service INTEGER,
    date TEXT,
    issuetime TEXT,
    status TEXT,
    counter INTEGER,
    calledtime TEXT,
    finishedtime TEXT
  )`);

  // Create CounterServices table
  db.run(`CREATE TABLE CounterServices (
    counter INTEGER,
    service INTEGER
  )`);

  // Seed Services
  const insertService = db.prepare('INSERT INTO Services (type, servicetime, count) VALUES (?, ?, ?)');
  insertService.run('deposit', 5, 0); // id = 1
  insertService.run('package', 7, 0); // id = 2
  insertService.finalize();

  // Seed CounterServices: counter 1 serves deposit, counter 2 serves deposit and package
  const insertCS = db.prepare('INSERT INTO CounterServices (counter, service) VALUES (?, ?)');
  insertCS.run(1, 1);
  insertCS.run(2, 1);
  insertCS.run(2, 2);
  insertCS.finalize();

  console.log('Test DB created and seeded at', DB_PATH);
});

db.close();
