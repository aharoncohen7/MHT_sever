const db = require('../../DL/db');

const table = "posts";

async function create(){
    
}
async function read(where, orderBy){

    let query = `SELECT * FROM ${table}`
    
    if(where){

    }
    
    if(orderBy){
        query += ` ORDER BY ${orderBy}`;
    }

    let [res] = await db.query(query)
    return res;
}

async function readOne(id){
    let query = `SELECT * FROM ${table}
    WHERE id = ${id}`;
    let [[res]] = await db.query(query)
    return res;
}

async function update(){}
async function del(){}

module.exports ={create,read,readOne,update,del}