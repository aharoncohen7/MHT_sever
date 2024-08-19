const express = require("express");
const loginRoute = express.Router();
const auth = require('../../middlewares/auth');
const IAM = require('../../middlewares/monitoring');
const usersModule = require("../users/users.module");
const { sendVerificationEmail, htmlForVerification } = require("../../verification");


// login
loginRoute.post("/", async (req, res) => {
    console.log("start login");
    try {
        const check = await usersModule.checkUser(req.body.username, req.body.password);
        console.log(!!check);
        if (!check) {
            res.status(404).send("user not found");
            return;
        }
        const user = await usersModule.getUser(parseFloat(check));
        console.log(user);
        if (user) {
            const token = await auth.generateToken(user)
            user.token = token;
            res.json(user);
            return;
        }
        res.status(404).send("Internal server error");
    } catch (error) {
        res.status(500).send("error.message: " + error.message);
    }
});

// בדיקת טוקן
loginRoute.post("/checkToken", auth.validate, async (req, res) => {
    console.log(req.body, "checkToken")
    const user = {
        userId: req.body.userIdFromToken,
        isAdmin: req.body.isAdmin
    }
    res.status(200).send(user);
})

//כנראה לא פעיל
// בדיקת תוקף טוקן
loginRoute.post("/isTokenExpired", async (req, res) => {
    console.log(req.body.token);
    try {
        const expired = auth.isTokenExpired(req.body.token);
        if (expired) {
            console.log('הטוקן פג תוקף');
            res.status(400).send();
            return;
        }
        console.log('הטוקן בתוקף');
        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});


// שליחת אימייל
loginRoute.post("/verification", async (req, res) => {
    try {
        const verificationToken = await auth.generateTokenForNewUser(req.body.email);
        const message = await sendVerificationEmail(req.body.email, verificationToken);
        if (message){
            res.status(200).send(message);
            return;
        }
        res.status(500).json("error: Verification failed")
        
       
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});




loginRoute.get("/verify-email/:token", async (req, res) => {
    try {
      let userFromToken = auth.verificationToken(req.params.token)
      if (!userFromToken) {
        res.status(404).send("תקלה לא מזוהה באימות כתובת אימייל ");
        return;
      }
       res.send(htmlForVerification());
   } catch (error) {
       res.status(500).send();
   }
});







module.exports = loginRoute;






// לא שמיש
// //Get a specific user - not available
// loginRoute.get("/:id",IAM.authenticate, async (req, res) => {
//     console.log(req.user.id, req.params.id);
//     try {
//         if (parseInt(req.user.id) === parseInt(req.params.id)) {
//             console.log("Success");
//             res.json(req.user);
//             return;
//         }
//         res.status(400).send();
//     } catch (error) {
//         console.log(error);
//         res.status(500).send(error);
//     }
// });




// // login
// loginRoute.post("/admin", async (req, res) => {
//     console.log("start login");
//     try {
//         const check = await usersModule.checkUser(req.body.username, req.body.password);
//         console.log(!!check);
//         if (!check) {
//             res.status(404).send("admin not found");
//             return;
//         }
//         const user = await IAM.getUser(parseFloat(check));
//         if (user) {
//             const token = await auth.generateToken({
//                 id: user.id,
//                 username: req.body.username,
//                 password: req.body.password,
//             })
//             user.token = token;
//             res.json(user);
//             return;
//         }
//         res.status(404).send("Internal server error");
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });