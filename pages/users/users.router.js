const express = require("express");
const IAM = require("../../middlewares/monitoring");
const usersModule = require("./users.module");
const usersRoute = express.Router();

//READE
//Get all users
usersRoute.get("/", IAM.checkPermission, async (req, res) => {
    try {
        const users = await usersModule.getUsers();
        if (users) {
            res.json(users);
            return;
        }
        res.status(404).send("User not found");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Get a specific user
usersRoute.get("/:userId", IAM.validationParams, IAM.checkPermission, async (req, res) => {
  
    try {
        const user = await usersModule.getUser(req.params.userId);
        if (user) {
            res.json(user);
            return;
        }
        res.status(404).send("User not found");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//UPDATE
// Editing user
usersRoute.patch("/:userId", IAM.validationParams, IAM.checkPermission, IAM.handleUpdateUser,  async (req, res) => {
    try {
        if (req.body.email) {
            const isExists = await usersModule.isUserExists(req.body.email);
            console.log(!!isExists);
            if (isExists) {
                res.status(400).send("כבר קיים משתמש עם אימייל זה");
                return;
            }
        }
        const updatedUser = await usersModule.updateUser(req.body, req.params.userId)
        if (updatedUser) {
            res.json(updatedUser);
            return;
        }
        res.status(404).send("תקלה לא מזוהה בעדכון משתמש");
    } catch (error) {
        res.status(500).send();
    }
});


usersRoute.patch("/set-admin/:userId", IAM.validationParams, IAM.checkAdminPermission,  async (req, res) => {
    try {
        const updatedUser = await usersModule.setAdmin(req.body.permission, req.params.userId)
        if (updatedUser) {
            res.json(updatedUser);
            return;
        }
        res.status(404).send("תקלה לא מזוהה בעדכון משתמש");
    } catch (error) {
        res.status(500).send();
    }
});











module.exports = usersRoute;
