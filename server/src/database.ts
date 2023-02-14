import { Database, OPEN_READONLY } from 'sqlite3';
// import path from 'path';
import { DBUsers } from './game/types';

// Open a SQLite database, stored in the file db.sqlite

class DBUno {
  static db: Database;

  static path = 'F:\\projects\\uno-app\\server\\src\\db\\db.sqlite';//path.join(__dirname, 'db/db.sqllite');

  static readAllUsers(): void {
    DBUno.db = new Database(DBUno.path, OPEN_READONLY, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Successfully connected to database in readonly mode!');
        DBUno.db.all('SELECT * FROM Users',
          (_, res: DBUsers[]) => console.log(...res),
        );
      }
      DBUno.db.close((e) => {
        if (e) {
          console.log(e);
        } else {
          console.log('Successfully disconnected from database!');
        }
      });
    });
  }

  static async checkUsersExist(userName: string): Promise<DBUsers> {
    DBUno.db = new Database(DBUno.path, OPEN_READONLY, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Successfully connected to database in readonly mode!');
      }
    });
    return new Promise(function (resolve, reject) {
      DBUno.db.get(`SELECT * FROM Users where UserName = '${userName}'`, function (err, row)  {
        if (err) reject('Read error: ' + err.message);
        else {
          resolve(row as Promise<DBUsers>);
        }
      });
    });
    // return new Promise((resolve, reject) => {
    //   let user: DBUsers;
    //   DBUno.db = new Database(DBUno.path, OPEN_READONLY, (err) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log('Successfully connected to database in readonly mode!');
    //     }
    //   });
    //   DBUno.db.get(`SELECT * FROM Users where UserName = '${userName}'`,
    //     (_, res: DBUsers) => {
    //       user = res;
    //     },
    //   );
    //   DBUno.db.close((err) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log('Successfully disconnected from database!');
    //     }
    //   });
    //   resolve(user);
    // });
  }
}
export default DBUno;
