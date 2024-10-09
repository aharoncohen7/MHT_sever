const express = require("express");
const postsRoute = express.Router();
const postsModule = require("../posts/posts.module");
const IAM = require("../../middlewares/monitoring");
const { addTagsToPost } = require("../tags/tags.module");
const { validate } = require("../../middlewares/auth");

//CREATE POSTS
// Add new post
postsRoute.post("/", validate, IAM.handleNewPost, async (req, res) => {
  try {
    console.log(req.body.userIdFromToken);
    if (req.body.userId != req.body.userIdFromToken) {
      res.status(400).send();
      return;
    }
    const newPost = await postsModule.addPost(
      req.body.userId,
      req.body.title,
      req.body.body,
      req.body.selectedBook,
      req.body.selectedPortion
    );
    console.log(newPost);
    if (newPost) {
      if (req.body.tags) {
        const tags = await addTagsToPost(newPost.id, req.body.tags);
        if (tags) {
          console.log("פוסט נוצר בהצלחה תגיות נוספו");
          newPost.tags = tags.join(",");
        } else {
          console.log("פוסט נוצר בהצלחה אך תגיות לא נוספו");
        }
      } else {
        console.log("פוסט נוצר בהצלח");
      }
      res.status(201).json(newPost);
      return;
    }

    res.status(400).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//READ POSTS
// Get all posts
postsRoute.get("/", async (req, res) => {
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
postsRoute.get("/:postId/", IAM.validationParams, async (req, res) => {
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

// UPDATE POSTS
postsRoute.patch(
  "/:postId",
  validate,
  IAM.validationParams,
  IAM.handleEditPost,
  async (req, res) => {
    console.log("edit");
    try {
      if (!req.body.isAdmin) {
        res.status(400).send("משתמש לא מורשה");
        return;
      }

      const editedPost = await postsModule.editPost(
        req.params.postId,
        req.body.selectedBook,
        req.body.selectedPortion,
        req.body.title,
        req.body.body
      );
      console.log("");
      if (editedPost) {
        if (req.body.tags) {
          const tags = await addTagsToPost(editedPost.id, req.body.tags);
          if (tags) {
            console.log("פוסט עודכן בהצלחה תגיות נוספו");
            editedPost.tags = tags.join(",");
          } else {
            console.log("פוסט עודכן בהצלחה אך תגיות לא נוספו");
          }
        } else {
          console.log("פוסט עודכן בהצלחה");
        }
        res.status(200).json(editedPost);
        return;
      }
      res.status(404).send();
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  }
);

//  rating a post
postsRoute.patch(
  "/rating/:postId",
  validate,
  IAM.validationParams,
  IAM.handleRatingUpdating,
  async (req, res) => {
    try {
      const oldPost = await postsModule.getCertainPost(req.params.postId);
      if (!oldPost) {
        res.status(404).send();
        return;
      }

      const editedPost = await postsModule.updateRatingPost(
        req.params.postId,
        req.body.userIdFromToken,
        req.body.newRating
      );
      if (editedPost) {
        res.status(200).json(editedPost);
        return;
      }
      res.status(404).send();
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  }
);

//DELETE POSTS
//Delete single post
postsRoute.delete(
  "/delete-single/:postId",
  validate,
  IAM.validationParams,
  async (req, res) => {
    try {
      const post = await postsModule.getCertainPost(
        parseInt(req.params.postId)
      );
      if (!post) {
        res.status(404).send();
        return;
      }
      const deletedPost = await postsModule.deletePost(
        parseInt(req.params.postId)
      );
      if (deletedPost) {
        console.log("the post was deleted");
        res.status(200).json(deletedPost);
        return;
      }
      res.status(404).send();
      return;
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

// Delete array of posts
postsRoute.delete(
  "/delete-multiple",
  validate,
  IAM.validationArray,
  IAM.checkPermission,
  async (req, res) => {
    console.log(req.body, req.params);
    try {
      const isSuccessfulDeletion = await postsModule.deleteMultiplePosts(
        req.body.postList
      );
      if (isSuccessfulDeletion) {
        console.log("the postlist has been deleted");
        res.sendStatus(200);
        return;
      }
      res.status(404).send();
      return;
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

module.exports = postsRoute;
