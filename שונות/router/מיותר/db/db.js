const sql = require('mysql2/promise');
require("dotenv").config();

const dbConfig = {
    host: "localhost",
    user: "root",
    database: "db_mht",
}

const pool = sql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    password: "43534613"
});

console.log("create pool");

module.exports = pool
