const Joi = require("joi");
const pool = require('../DL/db');
const usersModule = require("../pages/users/users.module");

//CHECK user/admin permission
function checkPermission(req, res, next) {
    const schema = Joi.object({
        userIdFromToken: Joi.number().min(0),
        isAdmin: Joi.number().min(0).max(3).required(),
        username: Joi.string()
    })
    const { error } = schema.validate(req.body);
    if (error) {
        console.log(error.details[0].message)
        res.status(403).json({ error: error.details[0].message});
        return
    }
    console.log("error2")
    if (((req.body.isAdmin > 0) || (req.params.userId == req.body.userIdFromToken))) {
        next();
    }
    else {
        console.log("error")
        res.status(403).json({ error: 'Permission denied' });
    }
}


//CHECK admin permission
function checkAdminPermission(req, res, next) {
    console.log(req.body.isAdmin)
    const schema = Joi.object({
        userIdFromToken: Joi.number().min(0).messages({
            "string.min": "מספר מזהה לא תקין",
        }),
        permission: Joi.number().min(-5).max(3),
        username: Joi.string(),
        isAdmin: Joi.number().min(0).max(3).required()
        .messages({
            "string.min": "גישה נדחתה - אין הרשאה",
            "string.max": "הרשאה לא תקינה"
        }),
        status: Joi.string().valid('pending', 'answered', 'closed').optional(),
    })
    const { error } = schema.validate(req.body);
    if (error) {
        console.log(error.details[0].message)
        res.status(403).json({ error: error.details[0].message});
        return
    }
    if (req.body.isAdmin > 0) {
        
        next();
    }
    else {
        res.status(403).json({ error: 'Permission denied' });
    }
}

// Validation params
function validationParams(req, res, next) {
    console.log(req.params);
    const schema = Joi.number().min(1).required();
    const { error } = schema.validate(req.params.postId || req.params.userId || req.params.commentId);
    if (error) {
        console.log(error.details[0].message);
        res.status(400).send(error.details[0].message);
        return
    }
    next();
};


// אימות 'postList'
function validationArray(req, res, next) {
    console.log("validationArray");
    console.log(req.body.postList);
    const schema = Joi.array().items(Joi.number().min(1).required());
    const { error } = schema.validate(req.body.postList);
    if (error) {
        console.log("myaError: " + error.details[0].message);
        res.status(400).send(error.details[0].message);
        return;
    }
    next();
}


// Validation str 
function validationParamsStr(req, res, next) {
    const schema = Joi.string();
    const { error } = schema.validate(req.params.str || req.params.title || req.params.topic);
    if (error) {
        res.status(400).send(error.details[0].message);
        return
    }
    next();
};

// New user validation
function handleNewUser(req, res, next) {
    console.log("handle new user")
    const schema = Joi.object({
        name: Joi.string().max(20).required(),
        username: Joi.string().max(20).required(),
        phone: Joi.string().min(10).max(10).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            // .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])'))
            .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?!.*[\u0590-\u05FF])'))
            .min(4).max(8)
             .required()
             .messages({
                "string.pattern.base": "הסיסמה צריכה להכיל אותיות באנגלית, מספרים ואסור להכיל תווים בעברית.",
                "string.min": "הסיסמה צריכה להיות באורך מינימלי של 6 תווים.",
                "string.max": "הסיסמה צריכה להיות באורך מקסימלי של 10 תווים."
            })
             ,
    })
    const { error } = schema.validate(req.body);
    if (error) {
        console.log(error.details[0].message)
        res.status(400).send(error.details[0].message);
        return;
    }
    console.log("next");
    next();
}

// Update user validation
function handleUpdateUser(req, res, next) {
    console.log("handle update user");
    const schema = Joi.object({
        name: Joi.string().max(20),
        username: Joi.string().max(20),
        phone: Joi.string().min(10).max(10),
        email: Joi.string().email(),
        token: Joi.string().max(250),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?!.*[\u0590-\u05FF])'))
            .min(6).max(10)
            .messages({
                "string.pattern.base": "הסיסמה צריכה להכיל אותיות באנגלית, מספרים ואסור להכיל תווים בעברית.",
                "string.min": "הסיסמה צריכה להיות באורך מינימלי של 6 תווים.",
                "string.max": "הסיסמה צריכה להיות באורך מקסימלי של 10 תווים."
            }),
        userIdFromToken: Joi.number().min(0),
        isAdmin: Joi.number().min(0).max(3),
        username: Joi.string(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        console.log(error.details[0].message);
        res.status(400).send(error.details[0].message);
        return;
    }
    console.log("next");
    next();
}


// New post validation
function handleNewPost(req, res, next) {
    console.log("handle add Post")
    const schema = Joi.object({
        selectedBook: Joi.string().max(40).required(),
        selectedPortion: Joi.string().max(40).required(),
        title: Joi.string().max(120).required(),
        body: Joi.string().max(100000).required(),
        userId: Joi.number().min(1).required(),
        tags: Joi.array().items(Joi.string().max(20)),
        userIdFromToken: Joi.number().min(1).required(),
        isAdmin: Joi.number().min(0).max(3),
        username: Joi.string(),
        user: Joi.any(),
    })
    const { error } = schema.validate(req.body);
    if (error) {
        console.log(error.details[0].message)
        res.status(400).send(error.details[0].message);
        return;
    }
    console.log("next");
    next();
}

//Validation post update
function handleEditPost(req, res, next) {
    console.log("handle edit Post")
    const schema = Joi.object({
        selectedBook: Joi.string().max(40).required(),
        selectedPortion: Joi.string().max(40).required(),
        title: Joi.string().max(60).required(),
        body: Joi.string().max(100000).required(),
        tags: Joi.array().items(Joi.string().max(20)),
        userIdFromToken: Joi.number().min(1).required(),
        isAdmin: Joi.number().min(0).max(3).required(),
        username: Joi.string(),
        user: Joi.any(),
    })
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    console.log("next");
    next();
}



function handleRatingUpdating(req, res, next) {
    console.log(req.body);
    const schema = Joi.object({
        newRating: Joi.number().min(1).max(5).required(),
        userIdFromToken: Joi.number().min(1).required(),
        isAdmin: Joi.number().min(0).max(3),
        username: Joi.string(),
        user: Joi.any(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        console.log(error.details[0].message);
        res.status(400).send(error.details[0].message);
        return;
    }

    next();
}

// Validate adding a new comment
function handleNewComment(req, res, next) {
    const schema = Joi.object({
        body: Joi.string().max(160).required(),
        postId: Joi.number().min(1).required(),
        userIdFromToken: Joi.number().min(1).required(),
        isAdmin: Joi.number().min(0).max(3),
        username: Joi.string(),
        user: Joi.any(),
    })
    const { error } = schema.validate(req.body);
    if (error) {
        console.log(error.details[0].message);
        res.status(400).send(error.details[0].message);
        return;
    }
    next();
}

// Validate adding a new tags
function handleNewTags(req, res, next) {
    const schema = Joi.object({
        postId: Joi.number().min(1).required(),
        tags: Joi.array().items(Joi.string().max(20).required()).required(),
        userIdFromToken: Joi.number().min(1).required(),
        isAdmin: Joi.number().min(0).max(3),
        username: Joi.string(),
        user: Joi.any(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    next();
}


module.exports = {
    handleUpdateUser,
    handleNewUser,
    checkPermission,
    checkAdminPermission,
    validationParams,
    validationArray,
    validationParamsStr,
    handleNewPost,
    handleEditPost,
    handleRatingUpdating,
    handleNewComment,
    handleNewTags,
};



// לא שמיש
//    קבלת סיסמה
//    async function getPassword(id) {
//        console.log("in getPassword() ");
//        const SQL = `select * from PASSWORDS where userId = ?`;
//        const [[user]] = await pool.query(SQL, [id]);
//        console.log(user);
//        return user;
//    }



// // AUTH check
// function isValidAuth(auth) {
//     if (!auth) {
//         return false;
//     }
//     const parts = auth.split(':');
//     return parts.length === 3 && parts.every(part => part.length > 0);
// }


// User authentication
// async function authenticate(req, res, next) {
//     try {
//         const auth = req.headers.auth;
//         if (!isValidAuth(auth)) {
//             res.status(400).send("Invalid auth");
//             return;
//         }
//         const [username, password] = auth.split(':');
//         const check = await usersModule.checkUser(username, password);
//         if (!check) {
//             res.status(400).send("You are not authorized!")
//             return;
//         }
//         const user = await getUser(check)
//         req.user = user;
//         next();
//     } catch (err) {
//         console.error(err);
//         res.status(500).send();
//     }
// }



// מיותרים למחוק

// //Get all users
// async function getUsers() {
//     // console.log("in getUsers() ");
//     const SQL = `select * from defaultdb.users`;
//     const [users] = await pool.query(SQL);
//     // console.log(user);
//     return users;
// }


// //Get specific user
// async function getUser(id) {
//     // console.log("in getUser() ");
//     const SQL = `select * from defaultdb.users where defaultdb.users.id = ?`;
//     const [[user]] = await pool.query(SQL, [id]);
//     // console.log(user);
//     return user;
// }


//Update user
// async function updateUser(body, id) {
//     const allowedFields = ['name', 'username', 'phone', 'email', 'password', 'isAdmin'];
//     const updates = [];
//     const values = [];
//     for (const [key, value] of Object.entries(body)) {
//         if (allowedFields.includes(key)) {
//             updates.push(`${key} = ?`);
//             values.push(value);
//         }
//     }
//     if (updates.length === 0) {
//         throw new Error('No valid fields provided for update');
//     }
//     const query = `UPDATE defaultdb.users SET ${updates.join(', ')} WHERE id = ?`;
//     values.push(id);
//     try {
//         const [response] = await pool.query(query, values);
//         console.log(response);
//         return response;
//     } catch (error) {
//         console.error('Error updating user:', error);
//         throw error;
//     }
// }


// // Comparing username to password
// async function checkUser(username, password) {
//     const SQL = `SELECT id, username, password
//    FROM users
//    JOIN passwords ON users.id = passwords.userId
//     where username = ? and  password = ?`
//     const [[user]] = await pool.query(SQL, [username, password]);
//     if (user === undefined) {
//         return 0;
//     }
//     else {
//         return user.id;
//     }
// }