const {QuestionModel} = require("./question.module");
// CRUD
const read = (filter) => QuestionModel.find(filter);
const readOne = (filter) => QuestionModel.findOne(filter);
const update = (id, newData) => QuestionModel.findByIdAndUpdate(id, newData);
const del = (id) => QuestionModel.delete(id);
const create = (data) => QuestionModel.create(data);


module.exports ={create,read,readOne,update,del}
