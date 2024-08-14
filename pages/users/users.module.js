const pool = require('../../DL/db');


// CREATE
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


 // Comparing username to password
async function checkUser(username, password) {
    console.log("in checkUser", username, password);
    const SQL = `SELECT users.id, users.username, passwords.password
    FROM defaultdb.users
    JOIN defaultdb.passwords ON users.id = passwords.userId
    where users.username = ? and passwords.password = ?`
    const [[user]] = await pool.query(SQL, [username, password]);
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



//Get all users
async function getUsers() {
    // console.log("in getUsers() ");
    const SQL = `select * from defaultdb.users`;
    const [users] = await pool.query(SQL);
    // console.log(user);
    return users;
}

//Get specific user
async function getUser(id) {
    console.log("in getUser() ");
    const SQL = `select * from defaultdb.users where defaultdb.users.id = ?`;
    const [[user]] = await pool.query(SQL, [id]);
    if (user === undefined) {
        return 0;
    }
    return user;
}



//Update user
async function updateUser(body, id) {
    const allowedFields = ['name', 'username', 'phone', 'email'];
    const updates = [];
    const values = [];
    for (const [key, value] of Object.entries(body)) {
        if (allowedFields.includes(key)) {
            updates.push(`${key} = ?`);
            values.push(value);
        }
    }
    if (updates.length === 0) {
        throw new Error('No valid fields provided for update');
    }
    const query = `UPDATE defaultdb.users SET ${updates.join(', ')} WHERE id = ?`;
    values.push(id);
    try {
        const [response] = await pool.query(query, values);
        console.log(response);
        return response;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}


//Update user
async function setAdmin(permission, id) {
    const query = `UPDATE defaultdb.users SET isAdmin = ? WHERE id = ?`;
    try {
        const [response] = await pool.query(query, [permission, id]);
        console.log(response);
        return response;
    } catch (error) {
        console.error('Error updating permission:', error);
        throw error;
    }
}



async function test() {
    const data = await getUser(37)
    console.log(data);
}
// test()

module.exports = {
    getUser,
    getUsers,
    updateUser,
    setAdmin,
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
