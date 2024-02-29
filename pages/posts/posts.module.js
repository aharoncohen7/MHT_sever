const { log } = require('console');
const pool = require('../../DL/db');

// כל הפוסטים
async function getAllPosts() {
    const SQL = `SELECT posts.id, posts.userId, posts.topic,posts.subtopic, posts.title, posts.body, posts.created_at, posts.score / posts.num_raters as "rating", GROUP_CONCAT(tags.name) AS tags
    FROM posts
    LEFT JOIN 
    tags ON posts.id = tags.postId GROUP BY posts.id`;
    const [posts] = await pool.query(SQL);
    // console.log(posts);
    return posts;
}


// לפי נושא
async function searcByTopic(topic) {
    const SQL = `SELECT posts.id, posts.userId, posts.topic,posts.subtopic, posts.title, posts.body, posts.created_at, posts.score / posts.num_raters as "rating",
    GROUP_CONCAT(tags.name) AS tags
    FROM posts
    LEFT JOIN tags ON posts.id = tags.postId
    GROUP BY posts.id
    HAVING FIND_IN_SET(?, tags) > 0`;
    const [posts] = await pool.query(SQL, [topic]);
    // console.log(posts);
    return posts;
}

// מיון לפי א ב
async function getPostsOrderTitle() {
    const SQL = `SELECT id, userId, title, body, created_at, posts.score / posts.num_raters as "rating" FROM posts
    ORDER BY title;`;
    const [posts] = await pool.query(SQL);
    // console.log(posts);
    return posts;
}

// מיון לפי מזהה
async function getPostsOrderId() {
    const SQL = `SELECT id, userId, title, body, created_at, posts.score / posts.num_raters as "rating" FROM posts
    ORDER BY id;`;
    const [posts] = await pool.query(SQL);
    // console.log(posts);
    return posts;
}

// פוסט מסויים
async function getCertainPost(postId) {
    const SQL = `SELECT posts.id, posts.userId, posts.topic,posts.subtopic, posts.title, posts.body, posts.created_at, posts.num_raters, posts.score / posts.num_raters as "rating" FROM posts
    where id = ?`;
    const [[post]] = await pool.query(SQL, [postId]);
    // console.log(post);
    return post;
}

// לפי כותרת
async function searchPostByTitle(title) {
    const SQL = `SELECT id, userId, title, body, created_at, posts.score / posts.num_raters as "rating" FROM posts
    WHERE title LIKE '${title}%';`;
    const [respons] = await pool.query(SQL);
    return respons;
}

// לפי מזהה
async function searcById(id) {
    const SQL = `SELECT id, userId, title, body, created_at, posts.score / posts.num_raters as "rating" FROM posts
    WHERE id LIKE '${id}%';`;
    const [respons] = await pool.query(SQL);
    return respons;
}



// עריכה
async function editPost(postId, selectedBook, selectedPortion, title, body) {
    console.log("tttttttttttttttttttttttt");
    const SQL = `update posts set topic = ?,  subtopic = ?, title = ?, body = ?
    where id = ?`;
    const [respons] = await pool.query(SQL, [selectedBook, selectedPortion, title, body, postId]);
    console.log(respons);
    const updatedPost = await getCertainPost(postId)
    return updatedPost;
}


// דירוג
async function updateRatingPost(postId, userId, newRating) {
    console.log(postId, userId, newRating);
    //    קבלת זהות מדרגים קודמים
    const [respons1] = await pool.query('SELECT RatedByUsers FROM posts WHERE id = ?', [postId])
    if (!respons1.length) {
        return false
    }
    const SQL1 = `UPDATE posts
        SET RatedByUsers = 
        CASE 
            WHEN RatedByUsers IS NULL THEN ?
            WHEN FIND_IN_SET(?, RatedByUsers) = 0 THEN CONCAT(RatedByUsers, ',?')
            ELSE RatedByUsers
        END
        WHERE id = ?`;
    // דירוג בפועל
    const [respons2] = await pool.query(SQL1, [userId, userId, userId, postId]);
    // בדיקת זהות מדרגים נוכחית
    const [respons3] = await pool.query('SELECT RatedByUsers FROM posts WHERE id = ?', [postId])
    // השוואה אם נוצר שינוי
    console.log(respons1[0].RatedByUsers, respons3[0].RatedByUsers);
    if (respons1[0].RatedByUsers != respons3[0].RatedByUsers) {
        // אם נוסף מדרג חדש משמע הוא רשאי לדרג - ניגש לדירוג
        const SQL2 = `UPDATE posts
        SET score = score + ?,
        num_raters = num_raters + 1
        WHERE id = ?`;
        // דירוג בפועל
        const [respons4] = await pool.query(SQL2, [newRating, postId]);
        if (respons4.affectedRows) {
            // החזרת פוסט מדורג
            const updatedPost = await getCertainPost(postId)
            return updatedPost;
        }
    }
    else return false;
}

// מחיקה
async function deletePost(postId) {
    const deletedPost = await getCertainPost(postId)
    const SQL = `delete from posts where id = ?`;
    const [respons] = await pool.query(SQL, [postId]);
    return deletedPost;
}

// הוספה
async function addPost(userId, title, body, topic, subtopic) {
    console.log(userId, title, body, topic, subtopic);
    const SQL = `insert into posts (userId, title, body, topic, subtopic) 
    values (?, ?, ?, ?, ?)`;
    const [respons] = await pool.query(SQL, [userId, title, body, topic, subtopic]);
    console.log(respons.insertId);
    const newPost = await getCertainPost(respons.insertId)
    return newPost;
}


async function test() {
    const data = await updateRatingPost("231", 84, 5);
    // const all = await addPost(4, "פרשת בראשית", "dsfgdsfgdfgdfgdf", "בראשית", "וירא");
    console.log(data);
}
// test()



module.exports = {
    getAllPosts,
    searcByTopic,
    getPostsOrderId,
    getPostsOrderTitle,
    getCertainPost,
    searchPostByTitle,
    searcById,
    addPost,
    editPost,
    updateRatingPost,
    deletePost
};