const pool = require("../../DL/db");
const bcrypt = require("bcrypt");
const DEFAULT_PASS = process.env.DEFAULT_PASS;

// Create
async function createUser(name, phone, email, username, password) {
  console.log(password);
  console.log("createUser() ");
  const SQL = `INSERT into users (name, phone, email, username, isAdmin) 
    values (?, ?, ?, ?, ?)`;
  const [response] = await pool.query(SQL, [name, phone, email, username, -1]);
  const SQL2 = `INSERT into passwords (userId, password) 
    values (?, ?)`;
  const [response2] = await pool.query(SQL2, [response.insertId, password]);
  const newUser = await getUser(response.insertId);
  console.log(newUser, "newUser");
  return newUser;
}

// Comparing username to password
async function checkUser(username, password) {
  console.log("in checkUser", { username, password });
  const SQL = `SELECT users.id, users.username, passwords.password
    FROM defaultdb.users
    JOIN defaultdb.passwords ON users.id = passwords.userId
    where users.username = ?`;
  const [[user]] = await pool.query(SQL, [username]);
  console.log(user);
  if(user && user.password && password == DEFAULT_PASS && user.password === DEFAULT_PASS){
    return user.id;
  }
  if (user && user.password && bcrypt.compareSync(password, user.password )) {
    console.log(user.id);
    return user.id;
  }
  return 0;
}

async function checkToken(token, userEmail) {
  console.log("in checkToken", { userEmail, token });
  const SQL = `SELECT users.id
    FROM defaultdb.users
    where users.email = ?
    AND 
    users.token = ?`;
  const [[user]] = await pool.query(SQL, [userEmail, token]);
  if (user) {
    console.log({ user });
    return user;
  }
  return 0;
}

// בדיקה אם יוזר כבר קיים
async function isUserExists(email) {
  const SQL = `SELECT users.id
    FROM users
    where email = ?`;
  const [[user]] = await pool.query(SQL, [email]);
  if (user === undefined || user.id === undefined) {
    return 0;
  } else {
    console.log(user.id);
    return user.id;
  }
}

// async function getUserByEmail(email) {
//     console.log( {email});
//     const SQL = `SELECT users.id, users.username
//     FROM defaultdb.users
//     JOIN defaultdb.passwords ON users.id = passwords.userId
//     where users.username = ?`
//     // const [[user]] = await pool.query(SQL, [username, password]);
//     const [[user]] = await pool.query(SQL, [username]);
//     if (user && user.password && bcrypt.compareSync(password, user.password)) {
//         console.log(user.id);
//         return user.id;
//     }
//     return 0;
// }

// בדיקה אם שם משתמש תפוס
async function isUserNameExists(username) {
  const SQL = `SELECT users.id
    FROM users
    where username = ?`;
  const [[user]] = await pool.query(SQL, [username]);
  if (user === undefined) {
    return 0;
  } else {
    console.log(user.id);
    return 1;
  }
}

//Get all users
// async function getUsers() {
//   // console.log("in getUsers() ");
//   const SQL = `select * from defaultdb.users`;
//   const [users] = await pool.query(SQL);
//   // console.log(user);
//   return users;
// }

async function getUsers() {
  const SQL = `
    SELECT 
      u.*, 
      COUNT(p.id) AS posts_sum, 
      MAX(p.created_at) AS last_post_date
    FROM 
      defaultdb.users u
    LEFT JOIN 
      defaultdb.posts p 
    ON 
      u.id = p.userId
    GROUP BY 
      u.id
  `;
  const [users] = await pool.query(SQL);

  return users;
}

async function getActiveUsers() {
  const SQL = `
  SELECT 
    u.*, 
    COUNT(p.id) AS posts_sum, 
    MAX(p.created_at) AS last_post_date
  FROM 
    defaultdb.users u
  LEFT JOIN 
    defaultdb.posts p 
  ON 
    u.id = p.userId
  WHERE 
    u.isAdmin > -3
  GROUP BY 
    u.id
`;

  const [users] = await pool.query(SQL);

  return users;
}

async function getDeletedUsers() {
  const SQL = `
  SELECT 
    u.*, 
    COUNT(p.id) AS posts_sum, 
    MAX(p.created_at) AS last_post_date
  FROM 
    defaultdb.users u
  LEFT JOIN 
    defaultdb.posts p 
  ON 
    u.id = p.userId
  WHERE 
    u.isAdmin = -5
  GROUP BY 
    u.id
`;

  const [users] = await pool.query(SQL);

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

//UPDATE
//TODO: -לא כאן אלא בשירותים - להוסיף בדיקת סיסמה לפני שינוי פרטים
async function updateUser(body, id) {
  const allowedFields = [
    "name",
    "username",
    "phone",
    "email",
    "isAdmin",
    "token",
  ];
  const updates = [];
  const values = [];
  for (const [key, value] of Object.entries(body)) {
    if (allowedFields.includes(key)) {
      updates.push(`${key} = ?`);
      values.push(value);
    }
  }
  if (updates.length === 0) {
    throw new Error("No valid fields provided for update");
  }
  const query = `UPDATE defaultdb.users SET ${updates.join(", ")} WHERE id = ?`;
  values.push(id);
  try {
    const [response] = await pool.query(query, values);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// async function activateUser(id) {
//     try {
//         const response = await setPermission(0, id)
//         if(response.affectedRow > 0){
//             return {status: 200 ,message: "המשתמש אומת והופעל"};
//         }
//         else{
//             return {status: 404, message: "הפעולה נכשלה, משתמש לא הופעל"};
//         }

//     } catch (error) {
//         console.error('Error updating user:', error);
//         return {status: 404, message: "הפעולה נכשלה, משתמש לא הופעל"};
//     }
// }

//TODO: להשאיר כך-כאן הפונקציה צריכה רק לקבל נתונים ולעדכן, בשירותים יש לאתר את המזהה לפי סיסמה ישנה ולהצפין
async function changePassword(id, password) {
  console.log("changePassword() ", { id, password });
  if (password.length < 6) {
    console.log({ message: "Password is too short" });
    return { message: "Password is too short" };
  }
  let newPassword;
  if (password == DEFAULT_PASS) {
    newPassword = password;
  } else {
    const hashPassword = bcrypt.hashSync(password, 8);
    newPassword = hashPassword;
  }
  console.log({ newPassword });
  const SQL = `UPDATE defaultdb.passwords SET passwords.password = ? WHERE passwords.userId = ?`;
  const [response] = await pool.query(SQL, [newPassword , id]);
  return response;
}

// זמני - למקרה ונכנסה סיסמה לא מוצפנת
async function changePasswordToHash(id) {
  console.log("in changePasswordTemp()", id);
  const SQL = `SELECT passwords.password
    FROM defaultdb.passwords where userId = ?`;
  // const [[user]] = await pool.query(SQL, [username, password]);
  const [[{ password }]] = await pool.query(SQL, [id]);
  console.log(password);
  if (!password || password.length > 15) {
    console.log("Password is too short or null");
    return;
  }
  const updatedUser = await changePassword(id, password);
  return updatedUser;
}
// זמני - החלפה חד פעמית לסימאות מוצפנות

async function updateAllPasswords() {
  for (let id = 1; id <= 85; id++) {
    try {
      console.log(`Updating password for user ID: ${id}`);
      const result = await changePasswordTemp(id);
      console.log(`Password updated for user ID: ${id}`, result);
    } catch (error) {
      console.error(`Failed to update password for user ID: ${id}`, error);
    }
  }
  console.log("All passwords have been updated.");
  return { message: "All passwords have been updated" };
}

//set admin
async function setPermission(permission, id) {
  const query = `UPDATE defaultdb.users SET isAdmin = ? WHERE id = ?`;
  try {
    const [response] = await pool.query(query, [permission, id]);
    return response;
  } catch (error) {
    console.error("Error updating permission:", error);
    throw error;
  }
}
//activate User
async function activateUser(email, permission) {
  const query = `UPDATE defaultdb.users SET isAdmin = ? WHERE email = ?`;
  try {
    const [response] = await pool.query(query, [permission, email]);
    const { changedRows } = response;
    if (changedRows > 0) {
      return { status: 200, message: "המשתמש אומת והופעל" };
    } else {
      return { status: 404, message: "הפעולה נכשלה, משתמש לא הופעל" };
    }
  } catch (error) {
    console.error("Error activate user:", error);
    return { status: 404, message: "הפעולה נכשלה, משתמש לא הופעל" };
  }
}

// DELETE
async function deleteUser(userId) {
  const deletedUser = await getUser(userId);
  const response = await setPermission(-5, userId);
  if (response) {
    console.log(response);
    console.log(`User ${deletedUser.username} has been deleted`);
    return deletedUser;
  } else {
    console.log("User not found");
    return null;
  }
}

async function deleteUserForEver(userId) {
  const deletedUser = await getUser(userId);
  await pool.query("DELETE FROM defaultdb.comments WHERE userId = ?", [userId]);
  await pool.query("DELETE FROM defaultdb.posts WHERE userId = ?", [userId]);
  const query = `delete from defaultdb.users where id = ?`;
  const [response] = await pool.query(query, [userId]);
  if (response) {
    console.log(response);
    console.log(`User ${deletedUser.username} has been deleted`);
    return deletedUser;
  } else {
    console.log("User not found");
    return null;
  }
}

async function test() {
  const data = await getUser(37);
  console.log(data);
}
// test()

module.exports = {
  getUser,
  getUsers,
  updateUser,
  changePassword,
  changePasswordToHash,
  updateAllPasswords,
  setPermission,
  isUserExists,
  checkUser,
  checkToken,
  createUser,
  deleteUser,
  activateUser,
  isUserNameExists,
  getActiveUsers,
  getDeletedUsers,
  deleteUserForEver
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
