const sql = require('mysql2/promise');
require("dotenv").config();

const dbConfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_DBNAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,

}


// const dbConfig = {
//     host: "localhost",
//     user: "root",
//     database: "db_mht",
//     password: "43534613",
//     port: 3306
// }


const pool = sql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    password: dbConfig.password,
    port: dbConfig.port,
    connectTimeout: 60000
});


async function getAllUsers() {
    const SQL = `SELECT * FROM defaultdb.users`;
    try {
      const [users] = await pool.query(SQL);
      console.log(users);
    } catch (err) {
      console.error(err);
    } finally {
      pool.end(); // אם אתה רוצה לנתק את כל החיבורים בסוף
    }
  }



console.log("create pool");

// getAllUsers()



module.exports = pool



