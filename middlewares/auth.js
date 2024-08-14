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
    console.log("user validation")
    if(!isValidToken(req.headers.authorization?.split('Bearer ')[1] || "null")){
        console.log(401);
        return res.status(401).json({ error: 'No token provided/Invalid token' }); 
    }
    try {
        console.log(req.body);
        let userFromToken = jwt.verify(req.headers.authorization?.split('Bearer ')[1] || "null", SECRET)
        req.body.userIdFromToken = userFromToken.id;
        req.body.isAdmin = userFromToken.isAdmin;
        console.log(req.body);
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Token expired'  + err.name});
    }
}


// כנראה לא פעיל
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


// check validity of the token
function isValidToken(token) {
    console.log(token)
    if (!token) {
        return false;
    }
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
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




