
const postsModule = require("../posts/posts.module");
const { addTagsToPost } = require("../tags/tags.module");
const IAM = require('../../middlewares/monitoring');
// const postController = require('../DL/post.controller')

//הכנה ל4 שכבות

async function getAllPosts (){
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
}























module.exports = {
    getAllPosts


}