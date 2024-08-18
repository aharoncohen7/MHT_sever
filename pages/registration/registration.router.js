const express = require("express");
const registrationRoute = express.Router();
const usersModule = require("../users/users.module");
const IAM = require('../../middlewares/monitoring');
const bcrypt = require("bcrypt");

// register
registrationRoute.post("/", IAM.handleNewUser, async (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 8);
    console.log("🚀 ~ registrationRoute.post ~ password:", password)
    
    try {
        const isExists = await usersModule.isUserExists(email);
        console.log(!!isExists);
        if (isExists) {
            res.status(400).send("כבר קיים משתמש עם אימייל זה");
            return;
        }                                   
        const newUser = await usersModule.createUser(name, phone, email, username, password);
        if (newUser) {
            res.json(newUser);
            return;
        }
        res.status(404).send("תקלה לא מזוהה ביצירת משתמש");
    } catch (error) {
        res.status(500).send();
    }
});



module.exports = registrationRoute;