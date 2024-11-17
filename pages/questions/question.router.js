const IAM = require("../../middlewares/monitoring");
const { validate } = require('../../middlewares/auth');
const express = require("express");
const QuestionService = require("./question.service");
const questionRoute = express.Router();

// create question
questionRoute.post("/", async (req, res) => {
    try {
        const question = await QuestionService.create(req.body);
        if (question) {
            res.status(200).json(question);
            return;
        }
        res.status(404).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});



// Get all questions
questionRoute.get("/",validate, IAM.checkAdminPermission, async (req, res) => {
    try {
        const questions = await QuestionService.get();
        if (questions) {
            res.status(200).json(questions);
            return;
        }
        res.status(404).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});


//update status
questionRoute.put("/:questionId",
    validate, IAM.checkAdminPermission, 
    async (req, res) => {
    console.log("start update question");
    const questionId = req.params.questionId;
    const status = req.body.status;
    try {
        const updatedQuestion = await QuestionService.updateById(questionId, {status})
        console.log(updatedQuestion);
        res.status(200).send(updatedQuestion)
    }
    catch (err) {
        res.status(400).send(err.msg || err.message || "wrong")
    }
});



//delete (update)
questionRoute.delete("/:questionId",
    validate, IAM.checkAdminPermission, 
    async (req, res) => {
    console.log("start delete question");
    const questionId = req.params.questionId;
    try {
        const updatedQuestion = await QuestionService.deleteById(questionId)
        console.log(updatedQuestion);
        res.status(200).send(updatedQuestion)
    }
    catch (err) {
        res.status(400).send(err.msg || err.message || "wrong")
    }
});
   

module.exports = questionRoute;





