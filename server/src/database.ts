import { Database, OPEN_READONLY, OPEN_READWRITE } from 'sqlite3';
// import path from 'path';
import { DBUsers } from './game/types';
import chalk from 'chalk';

class DBUno {
  static db: Database;

  static path = 'F:\\projects\\uno-app\\server\\src\\db\\db.sqlite';//path.join(__dirname, 'db/db.sqllite');

  static async readAllUsers(): Promise<void> {
    await DBUno.openDB().then(() => {
      DBUno.db.all('SELECT * FROM Users',
        (_, res: DBUsers[]) => console.log(...res),
      );
    });
  }

  static closeDB() {
    DBUno.db.close((e) => {
      if (e) {
        console.log(e);
      } else {
        console.log(chalk.bgGreen('Successfully disconnected from database!'));
      }
    });
  }

  static async openDB(flag = 'read') {
    DBUno.db = new Database(DBUno.path, flag === 'read' ? OPEN_READONLY : OPEN_READWRITE, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(chalk.bgGreen(`Successfully connected to database in ${flag === 'read' ? 'readonly' : 'read/write'} mode!`));
      }
    });
  }

  // static async checkUsersExist(userName: string):void {
  //   // await DBUno.openDB();
  //   // console.log(DBUno.db.get('SELECT * FROM Users', () => {}).);
  //   // return new Promise((resolve, reject) => {
  //   //   DBUno.db.get('SELECT * FROM Users where UserName = ', function (err, row)  {
  //   //     if (err) reject('Read error: ' + err.message);
  //   //     else {
  //   //       resolve(row as Promise<DBUsers>);
  //   //     }
  //   //   });
  //   // });
  // }

  // static async addUserToDB(user: DBUsers): Promise<DBUsers> {
  //   DBUno.openDB('write')
  //   return new Promise(function (resolve, reject) {
  //     DBUno.db.get(`SELECT * FROM Users where UserName = '${userName}'`, function (err, row)  {
  //       if (err) reject('Read error: ' + err.message);
  //       else {
  //         resolve(row as Promise<DBUsers>);
  //       }
  //     });
  //   });
  // }
}
export default DBUno;
