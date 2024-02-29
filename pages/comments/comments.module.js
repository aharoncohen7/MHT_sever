const { log } = require('console');
const pool = require('../../DL/db');

// Get all COMMENTS
async function getCommentsByPostId(postId) {
    // console.log("getComments() ");
    const SQL = `select * from comments where postId = ?`;
    const [comments] = await pool.query(SQL, [postId]);
    return comments;
}

// Get a particular comment
async function getCertainComment(commentId) {
    // console.log("getCertainComment() ");
    const SQL = `select * from comments where id = ?`;
    const [comment] = await pool.query(SQL, [commentId]);
    return comment;
}


// Checking if a post exists to add a comment on it
async function isPostExist(postId) {
    const SQL = `SELECT userId FROM posts WHERE id = ?`;
    const [[postUserId]] = await pool.query(SQL, [postId]);
    return !!postUserId; 
}

//  addition
async function addComment(postId, name, email, body) {
    const SQL = `insert into comments (postId, name, email, body ) values (?, ?, ?, ?)`;
    const [respons] = await pool.query(SQL, [postId, name, email, body]);
    const newComment = await getCertainComment(respons.insertId)
    return newComment;
}

// deletion
async function deleteComment(commentId) {
    const [deletedComment] = await getCertainComment(commentId)
    const SQL = `delete from comments where id = ?`;
    const [response] = await pool.query(SQL, [commentId]);
    return deletedComment;
}


// Checking the owner of the comment
async function checkOwnerComment(commentEmail) {
    const SQL = `SELECT users.id
    FROM users
    JOIN comments ON users.email = comments.email
    WHERE comments.email = ?;`;
    const [[response]] = await pool.query(SQL, [commentEmail]);
    if(response!=undefined){
        return response.id;
    }
    return 0;
}

// async function test(){
//     // const data = await checkOwnerComment('Sinere@april.biz')
//     const [data] = await getCertainComment(4090)
//     if(data==undefined){
//         console.log("not found");
//         return false
//     }
//     console.log(data.email);
// }
// test()


module.exports = {
    getCommentsByPostId,
    addComment,
    getCertainComment,
    deleteComment,
    isPostExist,
    checkOwnerComment
};