const pool = require('../../DL/db');

// בדיקת יוזר
async function checkUser(username, password) {
    const SQL = `SELECT users.id, users.username, passwords.password
    FROM users
    JOIN passwords ON users.id = passwords.userId
    where username = ? and password = ?`
    const [[user]] = await pool.query(SQL, [username, password]);
    console.log(username, password);
    if (user === undefined) {
        return 0;
    }
    else {
        console.log(user.id);
        return user.id;
    }
}

// בדיקה אם יוזר כבר קיים
async function isUserExists(email) {
    const SQL = `SELECT users.id
    FROM users
    where email = ?`
    const [[user]] = await pool.query(SQL, [email]);
    if (user === undefined) {
        return 0;
    }
    else {
        console.log(user.id);
        return 1;
    }
}

// הוספה
async function createUser(name, phone, email, username, password) {
    console.log(password);
    console.log("createUser() ");
    const SQL = `insert into users (name, phone, email, username) 
    values (?, ?, ?, ?)`;
    const [respons] = await pool.query(SQL, [name, phone, email, username]);
    const SQL2 = `insert into passwords (userId, password) 
    values (?, ?)`;
    const [respons2] = await pool.query(SQL2, [respons.insertId, password]);
    const newUser = await getUser(respons.insertId)
    console.log(newUser, "newUser");
    return newUser;
}

// get user
async function getUser(id) {
    console.log("getUser() ");
    const SQL = `SELECT users.id, name, username, email, phone
   FROM users
    where users.id = ?`
    const [[user]] = await pool.query(SQL, [id]);
    if (user === undefined) {
        return 0;
    }
    else {
        console.log(user);
        return user;
    }
}


async function test() {
    const data = await getUser(11)
    console.log(data);
}
// test()

module.exports = {
    isUserExists,
    checkUser,
    createUser
};







//השגת סיסמה באמצעות ID

// async function getPasswordByID(id) {
//     console.log("in getPasswordByID() ");
//     const SQL = `select * from PASSWORDS where userId = ?`;
//     const [[user]] = await pool.query(SQL, [id]);
//     console.log(user);
//     return user;
// }

// async function loginOld (username, password) {
//     console.log("in loginOld() ");
//     const userID = await getIdbyPassword(password);
//     const userID2 = await getIdbyUsername(username);
//    if(userID!==undefined&&userID2!==undefined){
//      console.log(userID.userId === userID2.id);
//     return (userID.userId === userID2.id)}
//     else {return false;}
// }



// async function getIdbyPassword(password) {
//     console.log("in getIdbyPassword() ");
//     const SQL = `select userId from PASSWORDS where password = ?`;
//     const [[theID]] = await pool.query(SQL, [password]);
//     if (theID === undefined) {
//         console.log("User not found or password incorrect");
//         // החזרת ערך ברירת המחדל או ניתוח פעולה נוספת
//         return -1; // החזרת ערך ברירת המחדל
//     }
//     return theID;
// }
// async function getIdbyUsername(username) {
//     console.log("in getIdbyUsername() ");
//     const SQL = `select id from users where username = ?`;
//     const [[theID]] = await pool.query(SQL, [username]);
//     return theID;
// }
