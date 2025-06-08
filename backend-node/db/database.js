// db/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// DB file stored in project root
const dbPath = path.resolve(__dirname, 'face_register.db');
const db = new sqlite3.Database(dbPath);

// Create table on startup if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      encoding TEXT NOT NULL
    )
  `);
});

module.exports = {
  addUser: (name, timestamp, encoding) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (name, timestamp, encoding) VALUES (?, ?, ?)',
        [name, timestamp, encoding],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  },

  countUsers: () => {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
        if (err) return reject(err);
        resolve(row.count);
      });
    });
  },

  getLastUser: () => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users ORDER BY timestamp DESC LIMIT 1',
        [],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  },

  getUserByName: (name) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE name = ?', [name], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }
};
