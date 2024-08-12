const jwt = require('jsonwebtoken');
const { getUser } = require('./monitoring');
const { log } = require('console');
const SECRET = process.env.SECRET

async function generate(user) {
    let token = jwt.sign(user, SECRET, { expiresIn: "200m" });
    return `Bearer ${token}`
}


// User authoreztion
async function validate(req, res, next) {
    console.log("object validation")
    try {
        console.log(req.body);
        let userFromToken = jwt.verify(req.headers.authorization?.split('Bearer ')[1] || "null", SECRET)
        req.body.userIdFromToken = userFromToken.id;
        req.body.isAdmin = userFromToken.isAdmin;
        console.log(req.body);
        // console.log(userFromToken.id,userFromToken.isAdmin, "ttt" );
        // const user = await getUser(userFromToken.id)
        // req.body.user = user;
        
        next();
    } catch (err) {
        console.error(err);
        console.log(401);
        res.status(401).json({ error: 'Token expired' }); // שליחת תגובת שגיאה עם מידע נוסף
    }
}

function isTokenExpired(token) {
    try {
        jwt.verify(token.split('Bearer ')[1] || "null", SECRET);
        return false;
    } catch (err) {
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
            return true;
        } else {
            console.log(err.name, "else");
            throw err;
        }
    }
}


async function test() {
    const data = await generate({})
    console.log(data);
}
// test()


module.exports = {
    generate,
    validate,
    isTokenExpired
}




