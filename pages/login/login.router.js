const express = require("express");
const loginRoute = express.Router();
const auth = require('../../middlewares/auth');
const IAM = require('../../middlewares/monitoring');
const db = require("../login/login.module");


// login
loginRoute.post("/", async (req, res) => {
    console.log("start login");
    try {
        const check = await db.checkUser(req.body.username, req.body.password);
        console.log(!!check);
        if (!check) {
            res.status(404).send("user not found");
            return;
        }
        const user = await IAM.getUser(parseFloat(check));
        console.log(user);
        if (user) {
            const token = await auth.generate({
                id: user.id,
                isAdmin: user.isAdmin,
                username: user.username,
                password: req.body.password,
            })
            user.token = token;
            res.json(user);
            return;
        }
        res.status(404).send("Internal server error");
    } catch (error) {
        res.status(500).send("uuuu" + error.message);
    }
});




// // login
// loginRoute.post("/admin", async (req, res) => {
//     console.log("start login");
//     try {
//         const check = await db.checkUser(req.body.username, req.body.password);
//         console.log(!!check);
//         if (!check) {
//             res.status(404).send("admin not found");
//             return;
//         }
//         const user = await IAM.getUser(parseFloat(check));
//         if (user) {
//             const token = await auth.generate({
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


// בדיקת טוקן
loginRoute.post("/checkToken", auth.validate, async (req, res) => {
    console.log(req.body, "EEEEE")
    const user = {
        userId: req.body.userIdFromToken,
        isAdmin: req.body.isAdmin
    }
    res.status(200).send(user);
})


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





module.exports = loginRoute;