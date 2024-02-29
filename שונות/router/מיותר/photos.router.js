const express = require("express");
const Joi = require("joi");
const db = require("../db/photos");
const IAM = require('../../../middlewares/monitoring');

const photosRoute = express.Router();

// Get photos from a specific album
photosRoute.get("/:albumId", IAM.validationParams,async (req, res) => {
    try {
        const album = await db.getPhotos(req.params.albumId);
        if (album) {
            res.json(album);
            return;
        }
        res.status(404).send();
        
  
    } catch (error) {
        res.status(500).send();
    }

});

// get certain image
photosRoute.get("/:photoId",IAM.validationParams, async (req, res) => {
    try {
      
        const photo = await db.getCertainPhoto(req.params.photoId);
        if (photo) {
            res.json(photo);
            return;
        }
        res.status(404).send();
       
    } catch (error) {
        res.status(500).send();
    }
});


// creation
photosRoute.post("/", IAM.handleNewPhoto, async (req, res) => { 
    try {
        const owner = await db.checkOwnerFhoto(req.body.albumId);
        if(!owner) {
            console.log("i am here ");
            res.status(404).send();
        }
        if(owner!=req.user.id){
            console.log("i am here 2");
            res.status(400).send("You are not allowed to add photo to this album");
            return
        }
        console.log({1:req.body.userId, 2:req.body.albumId,3: req.body.title, 4:req.body.url});
        const [newPhoto] = await db.addPhoto(req.body.albumId, req.body.title, req.body.url);
        if (newPhoto) {
            res.status(201).json(newPhoto);
            return;
        }
        res.status(400).send();
    } catch (error) {
        res.status(500).send(error);
    }
});


// Image editing
photosRoute.patch("/:photoId",IAM.handleEditPhoto, async (req, res) => {
    console.log("step1");
        try {
            const owner = await db.checkOwnerFhoto(req.body.albumId);
            if(!owner) {
                console.log("i am here ");
                res.status(404).send();
            }
            if(owner!=req.user.id){
                console.log("i am here 2");
                res.status(400).send("You are not allowed to edit this photo");
                return
            }
            console.log({2:req.body.albumId,3: req.body.title, 4:req.body.url});
            const photo = await db.editPhoto(req.params.photoId, req.body.title, req.body.url);
            console.log("step4");
            if (photo) {
                res.json(photo);
                return;
            }
            res.status(404).send();
           
        } catch (error) {
            res.status(500).send();
        }
    }
);

// Deleting images 
photosRoute.delete("/:photoId",IAM.validationParams, async (req, res) => {
    try {
        const deletedphoto = await db.deletePhoto(req.params.photoId);
        if (deletedphoto) {
            res.json(deletedphoto);
            return;
        }
        res.status(404).send();
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = photosRoute;
