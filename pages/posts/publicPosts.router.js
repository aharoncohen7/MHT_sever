const express = require("express");
const publicPostsRoute = express.Router();
const postsModule = require("../posts/posts.module");
const IAM = require('../../middlewares/monitoring');

//CREATE POSTS

//READ POSTS
// Get all posts
publicPostsRoute.get("/", async (req, res) => {
    try {
        const posts = await postsModule.getAllPosts();
        if (posts) {
            res.status(200).json(posts);
            return;
        }
        res.status(404).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get a particular post
publicPostsRoute.get("/:postId/", IAM.validationParams, async (req, res) => {
    try {
        const post = await postsModule.getCertainPost(req.params.postId);
        if (post) {
            res.status(200).json(post);
            return;
        }
        res.status(404).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Search by TOPIC
publicPostsRoute.get("/searchByTopic/:topic", IAM.validationParamsStr, async (req, res) => {
    try {
        const posts = await postsModule.searchByTopic(req.params.topic);
        if (posts) {
            res.status(200).json(posts);
            return;
        }
        res.status(404).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Search by title
publicPostsRoute.get("/searchPosts/:title", IAM.validationParamsStr, async (req, res) => {
    try {
        const posts = await postsModule.searchPostByTitle( req.params.title);
        if (posts) {
            res.status(200).json(posts);
            return;
        }
        res.status(404).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Search by ID
publicPostsRoute.get("/searchById/:postId", IAM.validationParams, async (req, res) => {
    try {
        const posts = await postsModule.searchById(req.params.postId);
        if (posts) {
            res.status(200).json(posts);
            return;
        }
        res.status(404).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = publicPostsRoute;