const express = require("express");
const db = require("./comments.module");
const Users = require("../users/users.module");
const IAM = require('../../middlewares/monitoring');
const publicCommentsRoute = express.Router();


// Get all comments for a particular post
publicCommentsRoute.get("/:postId",IAM.validationParams, async (req, res) => {
    try {
        const comments = await db.getCommentsByPostId(req.params.postId);
        if (comments) {
            res.status(200).json(comments);
            return;
        }
        res.status(404).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get a certain comment
publicCommentsRoute.get("/s/:commentId/",IAM.validationParams, async (req, res) => {
    try {
        const comment = await db.getCertainComment(req.params.commentId);
        if (comment) {
            res.status(200).json(comment);
            return;
        }
        res.status(404).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = publicCommentsRoute;