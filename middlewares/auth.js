const jwt = require('jsonwebtoken');
require("dotenv").config();
const SECRET = process.env.SECRET

async function generateToken(user) {
    const payload = {
        id: user.id,
        isAdmin: user.isAdmin,
        username: user.username,
    };
    let token = jwt.sign(payload, SECRET, { expiresIn: "4h" });
    return `Bearer ${token}`
}



async function generateTokenForNewUser(email) {
    const payload = {
        email,
        type: 'new-user'
    };
    let token = jwt.sign(payload, SECRET, { expiresIn: "1h" });
    return token
}



function generateResetTokenForUser(user) {
    const payload = {
        id: user.id,
        email: user.email,
        type: 'password-reset'
    };

    // יצירת טוקן עם תוקף של שעה
    const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });
    return token;
}


const verificationToken = (token)=>{
    try{
        const user = jwt.verify(token, SECRET)
        if(user){
            return { status: 200, user}
        }
        else{
            return { status: 404 }
        }
    }
    catch(err){
        if(err.name == "TokenExpiredError"){
            return { status: 401 }
        }
        else{
            console.log(err.name, "else");
            throw err;
        }
}
}



// User authoreztion
async function validate(req, res, next) {
    try {
        let userFromToken = jwt.verify(req.headers.authorization?.split('Bearer ')[1] || req.headers.authorization?.split('Bearer%')[1] || "null", SECRET)
        req.body.userIdFromToken = userFromToken.id;
        req.body.isAdmin = userFromToken.isAdmin;
        console.log(req.body);
        next();
    } catch (err) {
        console.log({ err });
        res.status(401).json({ error: 'Token expired: ' + err.name });
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
    const data = await generateToken({})
    console.log(data);
}
// test()


module.exports = {
    generateResetTokenForUser,
    generateTokenForNewUser,
    generateToken,
    verificationToken,
    validate,
    isTokenExpired

}




