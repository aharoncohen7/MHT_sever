const express = require("express");
const IAM = require("../../middlewares/monitoring");
const usersRoute = express.Router();


usersRoute.get("/", async (req, res) => {
    try {
        const users = await IAM.getUsers();
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
usersRoute.get("/:id",IAM.validationParams, async (req, res) => {
    try {
        if(req.user.id != req.params.id){
            res.status(400).send("You are not allowed to get this user");
            return;
        }
        const user = await IAM.getUser(req.params.id);
        if (user) {
            res.json(user);
            return;
        }
        res.status(404).send("User not found");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = usersRoute;
