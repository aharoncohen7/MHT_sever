const sql = require('mysql2/promise');
require("dotenv").config();

const dbConfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    database: process.env.DATABASE_DBNAME,
    password: process.env.DATABASE_PASSWORD
}


// const dbConfig = {
//     host: "vortly-mysql-vortly-mysql.a.aivencloud.com",
//     user: "avnadmin",
//     database: "defaultdb",
//     password: "AVNS_WuRwJsB47uljEAPF5jv"
// }


const pool = sql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    password: dbConfig.password
});




console.log("create pool" ,dbConfig.host,dbConfig.user, dbConfig.database, dbConfig.password);

module.exports = pool



