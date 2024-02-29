const Joi = require("joi");
const pool = require('../DL/db');
const { log } = require("console");

//Get specific user
async function getUser(id) {
    // console.log("in getUser() ");
    const SQL = `select * from users where id = ?`;
    const [[user]] = await pool.query(SQL, [id]); 
    // console.log(user);
    return user;
}

// Comparing username to password
async function checkUser(username, password) {
    const SQL = `SELECT id, username, password
   FROM users
   JOIN passwords ON users.id = passwords.userId
    where username = ? and  password = ?`
    const [[user]] = await pool.query(SQL, [username, password]);
    if (user === undefined) {
        return 0;
    }
    else {
        return user.id;
    }
}

// User authentication
async function authenticate(req, res, next) {
    try {
        const auth = req.headers.auth;
        if (!isValidAuth(auth)) {
            res.status(400).send("Invalid auth");
            return;
        }
        const [username, password] = auth.split(':');
        const check = await checkUser(username, password);
        if (!check) {
            res.status(400).send("You are not authorized!")
            return;
        }
        const user = await getUser(check)
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

// AUTH check
function isValidAuth(auth) {
    if (!auth) {
        return false;
    }
    const parts = auth.split(':');
    return parts.length === 3 && parts.every(part => part.length > 0);
}


// Validation params
function validationParams(req, res, next) {
    const schema = Joi.number().min(1).required();
    const { error } = schema.validate(req.params.postId || req.params.userId ||
         req.params.commentId);
    if (error) {
        res.status(400).send(error.details[0].message);
        return
    }
    next();
};


// Validation params
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
    console.log("New user")
    const schema = Joi.object({
        name: Joi.string().max(20).required(),
        username: Joi.string().max(20).required(),
        phone: Joi.string().min(10).max(10).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])'))
            // .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?!.*[\u0590-\u05FF])'))
            .min(4).max(8)
            .required(),
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

// New post validation
function handleNewPost(req, res, next) {
    console.log("addPost")
    const schema = Joi.object({
        selectedBook: Joi.string().max(40).required() ,
        selectedPortion: Joi.string().max(40).required(),
        title: Joi.string().max(60).required(),
        body: Joi.string().max(100000).required(),
        userId: Joi.number().min(1).required(),
        tags: Joi.array().items(Joi.string().max(20)),
        userIdFromToken:Joi.number().min(1).required(),
        isAdmin: Joi.number().min(0).max(1).required(),
        user:Joi.any(),
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

//Validation post editing
function handleEditPost(req, res, next) {
    const schema = Joi.object({
        selectedBook: Joi.string().max(40).required() ,
        selectedPortion: Joi.string().max(40).required(),
        title: Joi.string().max(60).required(),
        body: Joi.string().max(100000).required(),
        tags: Joi.array().items(Joi.string().max(20)),
        userIdFromToken:Joi.number().min(1).required(),
        isAdmin: Joi.number().min(0).max(1).required(),
        user:Joi.any(),
    })
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    next();
}

function handleRatingUpdating(req, res, next) {
    console.log(req.body);
    const schema = Joi.object({
      newRating: Joi.number().min(1).max(5).required(),
      userIdFromToken: Joi.number().min(1).required(),
      isAdmin: Joi.number().min(0).max(1).required(),
      user:Joi.any(),
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
        isAdmin: Joi.number().min(0).max(1).required(),
        user:Joi.any(),
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
        isAdmin: Joi.number().min(0).max(1).required(),
        user:Joi.any(),
      });
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    next();
  }
  

module.exports = {
    getUser,
    handleNewUser,
    validationParams,
    validationParamsStr,
    handleNewPost,
    handleEditPost,
    handleRatingUpdating,
    handleNewComment,
    authenticate,
    handleNewTags,
};




//    קבלת סיסמה
//    async function getPassword(id) {
//        console.log("in getPassword() ");
//        const SQL = `select * from PASSWORDS where userId = ?`;
//        const [[user]] = await pool.query(SQL, [id]);
//        console.log(user);
//        return user;
//    }
