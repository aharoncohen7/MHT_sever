const express = require("express");
const db = require("../tags/tags.module");
const db2 = require("../comments/comments.module");
const IAM = require('../../middlewares/monitoring');
const tagsRoute = express.Router();


// Get all tags 
tagsRoute.get("/", async (req, res) => {
    try {
        const tags = await db.getAllTags();
        if (tags) {
            res.status(200).json(tags);
            return;
        }
        res.status(404).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// Get all tags for a particular post
tagsRoute.get("/:postId",IAM.validationParams, async (req, res) => {
    try {
        const tags = await db.getTagsByPostId(req.params.postId);
        if (tags) {
            res.status(200).json(tags);
            return;
        }
        res.status(404).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//adding tags
tagsRoute.post("/",IAM.handleNewTags, async (req, res) => {
    try {
        const isPostExist = await db2.isPostExist(req.body.postId)
        if(!isPostExist) {
            res.status(400).send("It is impossible to add a tags to a post that does not exist");
        }
            const [newTags] = await db.addTagsToPost(req.body.postId, req.body.tags);
        if (newTags) {
            res.status(201).json(newTags);
            return;
        }
        res.status(400).send();
    } catch (error) {
        res.status(500).send(error.message)
    }
});



module.exports = tagsRoute;