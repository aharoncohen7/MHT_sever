const express = require("express");
const db = require("../comments/comments.module");
const {gerUser} = require("../login/login.module")
const IAM = require('../../middlewares/monitoring');
const commentsRoute = express.Router();


// Get all comments for a particular post
commentsRoute.get("/:postId",IAM.validationParams, async (req, res) => {
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
commentsRoute.get("/s/:commentId/",IAM.validationParams, async (req, res) => {
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

//adding comments
commentsRoute.post("/",IAM.handleNewComment, async (req, res) => {
    try {
        const isPostExist = await db.isPostExist(req.body.postId)
        if(!isPostExist) {
            res.status(400).send("It is impossible to add a comment to a post that does not exist");
            return;
        }
        console.log(req.body.userIdFromToken);
        const newComment = await db.addComment(req.body.postId, req.body.user.name, req.body.user.email, req.body.body);
        if (newComment) {
            res.status(201).json(newComment);
            return;
        }
        res.status(400).send();
    } catch (error) {
        res.status(500).send(error.message)
    }
});

//deleting comment
commentsRoute.delete("/:commentId",IAM.validationParams, async (req, res) => {
    try {
        const [comment] = await db.getCertainComment(req.params.commentId);
        if (comment==undefined) {
            res.status(404).send("Comment not found");
            return;
        }
        const ownerId = await db.checkOwnerComment(comment.email)
        if (req.body.userIdFromToken !== ownerId) {
            res.status(400).send("You are not allowed to delete this comment");
            return;
        }
        const deletedComment = await db.deleteComment(req.params.commentId);
        if (deletedComment) {
            res.json(deletedComment);
            return;
        }
        res.status(404).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});


module.exports = commentsRoute;