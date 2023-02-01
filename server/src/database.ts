import { Database } from 'sqlite3';

// Open a SQLite database, stored in the file db.sqlite
const db = new Database('../src/db/db.sqlite', (err) => err ? console.log(err) : 'connected');
// Fetch a random integer between -99 and +99
// let res = db.get('SELECT * FROM Users', (err,res) => err ? console.log(err) : 'successfully add')
console.log(db.all(
    'SELECT * FROM Users',
    (_, res) => console.log(res[0])
))
