// const fs = require('fs/promises');
// const mysql = require('mysql2/promise');
// require("dotenv").config();

// let dbName = "db_MHT";
// let num = 0;

// // פרטי חיבור לבסיס הנתונים
// const dbConfig = {
//   host: 'localhost',
//   user: 'root'
// };

// // יצירת חיבור לבסיס הנתונים באמצעות connection pool
// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: dbConfig.host,
//   user: dbConfig.user,
//   password: "43534613",
//   multipleStatements: true
// });

// // קריאת קובץ JSON
// async function readJsonFile(filePath) {
//   try {
//     const jsonData = await fs.readFile(filePath, 'utf-8');
//     return JSON.parse(jsonData);
//   } catch (error) {
//     console.error('Error reading JSON file:', error.message);
//     throw error;
//   }
// }

// // יצירת טבלאות
// async function createTables() {
//   try {

//     const dropSchema = `DROP DATABASE IF EXISTS ${dbName}`
//     const createSchema = `CREATE DATABASE IF NOT EXISTS ${dbName};`

//     const sqlUsers = `CREATE TABLE ${dbName}.users (
//             id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
//             name TEXT,
//             username TEXT,
//             email TEXT,
//             phone TEXT,
//             // website TEXT
//         )`;
//     const sqlPosts = `CREATE TABLE ${dbName}.posts (
//             id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
//             userId INT,
//             title TEXT,
//             body TEXT,
//             num_raters INT DEFAULT 0,
//             score DECIMAL(10, 1) DEFAULT 0.0,
//             rating DECIMAL(2, 1) DEFAULT 0.0,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//             FOREIGN KEY (userId) REFERENCES ${dbName}.users(id) ON DELETE CASCADE
//         )`;
//     const sqlComments = `CREATE TABLE ${dbName}.comments (
//             id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
//             postId INT,
//             name TEXT,
//             email TEXT,
//             body TEXT,
//             FOREIGN KEY (postId) REFERENCES ${dbName}.posts(id)  ON DELETE CASCADE
//         )`;
//     const sqlPasswords = `CREATE TABLE ${dbName}.passwords (
//             userId INT,
//             password TEXT,
//             FOREIGN KEY (userId) REFERENCES ${dbName}.users(id)  ON DELETE CASCADE
//         )`;
//     const sqlTags = `CREATE TABLE ${dbName}.tags(
//           id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
//           postId INT NOT NULL,
//           name TEXT,
//           FOREIGN KEY (postId) REFERENCES POSTS (id) ON DELETE CASCADE
//         )`;


//     // const insertPasswords = `INSERT INTO ${dbName}.passwords (userId, password)
//     //     VALUES 
//     //     (1, 'hildegard.org'),
//     //     (2, 'anastasia.net'),
//     //     (3, 'ramiro.info'),
//     //     (4, 'kale.biz'),
//     //     (5, 'demarco.info'),
//     //     (6, 'ola.org'),
//     //     (7, 'elvis.io'),
//     //     (8, 'jacynthe.com'),
//     //     (9, 'conrad.com'),
//     //     (10, 'ambrose.net');
//     //     `;

//     await pool.execute(dropSchema);
//     await pool.execute(createSchema);
//     await pool.execute(sqlUsers);
//     await pool.execute(sqlPosts);
//     await pool.execute(sqlComments);
//     await pool.execute(sqlPasswords);
//     await pool.execute(sqlTags);

//   } catch (error) {
//     console.error(`Error creating tables`, error.message);
//   }
// }

// // פונקציה להכנסת נתונים לטבלה
// async function insertDataIntoTable(tableName, data) {
//   const columns = Object.keys(data[0]).join(', ');

//   try {
   
//     for (const item of data) {
//       const placeholders = Array(Object.keys(item).length).fill('?').join(', ');
//       const sql = `INSERT INTO ${dbName}.${tableName} (${columns}) VALUES (${placeholders})`;

//       const values = Object.values(item);
//       const [rows] = await pool.execute(sql, values);
//       console.log(`Inserted ${tableName} record with ID ${rows.insertId}`);
//     }
//   } catch (error) {
//     console.error(`Error inserting data into ${tableName}:`, error.message);
//   }
// }


// // הכנסת נתונים לטבלאות
// async function fillTables() {
//   const dataFilePath = './db.json';

//   try {
//     const data = await readJsonFile(dataFilePath);
//     await insertDataIntoTable(`users`, data.users);
//     await insertDataIntoTable(`posts`, data.posts);
//     await insertDataIntoTable(`comments`, data.comments);

//     const insertPasswords = `INSERT INTO ${dbName}.passwords (userId, password)
//     VALUES 
//     (1, 'aA12345'),
//     (2, 'aA12345'),
//     (3, 'aA12345'),
//     (4, 'aA12345'),
//     (5, 'aA12345'),
//     (6, 'aA12345'),
//     (7, 'aA12345'),
//     (8, 'aA12345'),
//     (9, 'aA12345'),
//     (10, 'aA12345');
//     `;
//     await pool.execute(insertPasswords);

//   } catch (error) {
//     console.error('Error filling tables:', error.message);
//   } finally {
//     // סגירת חיבור לבסיס הנתונים
//     pool.end();
//   }
// }

async function makeDB() {

  if (num === 0) {
    num = 1;
    // הפעלת הפונקציה ליצירת הטבלאותn
    // await createTables();
    // הפעלת הפונקציה למילוי הטבלאות
    // await fillTables()
    console.log("rerewrwerwer");
  }

}

// makeDB()

// // Drop the database if it exists and create it
// DROP DATABASE IF EXISTS my_database; 
// CREATE DATABASE IF NOT EXISTS my_database; 

// // Create the users table
// CREATE TABLE users (
//     id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
//     name TEXT,
//     username TEXT,
//     email TEXT,
//     phone TEXT
// );

// // Create the posts table
// CREATE TABLE posts (
//     id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
//     userId INT,
//     title TEXT,
//     body TEXT,
//     num_raters INT DEFAULT 0,
//     score DECIMAL(10, 1) DEFAULT 0.0,
//     rating DECIMAL(2, 1) DEFAULT 0.0,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
// );

// // Create the comments table
// CREATE TABLE comments (
//     id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
//     postId INT,
//     name TEXT,
//     email TEXT,
//     body TEXT,
//     FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
// );

// // Create the passwords table
// CREATE TABLE passwords (
//     userId INT,
//     password TEXT,
//     FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
// );

// // Create the tags table
// CREATE TABLE tags (
//     id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
//     postId INT NOT NULL,
//     name TEXT,
//     FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
// );


// לצורך תרשים ERD

// Table users {
//   id int [primary key, auto_increment]
//   name text
//   username text
//   email text
//   phone text
// }

// Table posts {
//   id int [primary key, auto_increment]
//   userId int
//   title text
//   body text
//   num_raters int [default: 0]
//   score decimal(10,1) [default: 0.0]
//   rating decimal(2,1) [default: 0.0]
//   created_at timestamp [default: current_timestamp]
// }

// Table comments {
//   id int [primary key, auto_increment]
//   postId int
//   name text
//   email text
//   body text
// }

// Table passwords {
//   userId int
//   password text
// }

// Table tags {
//   id int [primary key, auto_increment]
//   postId int
//   name text
// }

// Ref: posts.userId > users.id // many-to-one
// Ref: comments.postId > posts.id // many-to-one
// Ref: passwords.userId > users.id // one-to-one
// Ref: tags.postId > posts.id // many-to-one
