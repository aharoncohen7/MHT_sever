const pool = require('../../DL/db');


//CREATE
// הוספה
async function addPost(userId, title, body, topic, subtopic) {
    console.log(userId, title, body, topic, subtopic);
    const query = `insert into posts (userId, title, body, topic, subtopic) 
    values (?, ?, ?, ?, ?)`;
    const [response] = await pool.query(query, [userId, title, body, topic, subtopic]);
    console.log(response.insertId);
    const newPost = await getCertainPost(response.insertId)
    return newPost;
}

//READE 
// כל הפוסטים
async function getAllPosts() {
    const query = `SELECT 
    posts.id, 
    posts.userId, 
    posts.topic,
    posts.subtopic, 
    posts.title, 
    posts.body, 
    posts.created_at, 
    posts.score / posts.num_raters as "rating", 
    GROUP_CONCAT(tags.name) AS tags,
    users.username AS author
FROM 
    posts
LEFT JOIN 
    tags ON posts.id = tags.postId 
LEFT JOIN 
    users ON posts.userId = users.id 
GROUP BY 
    posts.id;
`;
    const [posts] = await pool.query(query);
    // console.log(posts);
    return posts;
}

// לפי נושא
async function searchByTopic(topic) {
    const query = `SELECT posts.id, posts.userId, posts.topic,posts.subtopic, posts.title, posts.body, posts.created_at, posts.score / posts.num_raters as "rating",
    GROUP_CONCAT(tags.name) AS tags
    FROM posts
    LEFT JOIN tags ON posts.id = tags.postId
    GROUP BY posts.id
    HAVING FIND_IN_SET(?, tags) > 0`;
    const [posts] = await pool.query(query, [topic]);
    // console.log(posts);
    return posts;
}

// מיון לפי א ב
async function getPostsOrderTitle() {
    const query = `SELECT id, userId, title, body, created_at, posts.score / posts.num_raters as "rating" FROM posts
    ORDER BY title;`;
    const [posts] = await pool.query(query);
    // console.log(posts);
    return posts;
}

// מיון לפי מזהה
async function getPostsOrderId() {
    const query = `SELECT id, userId, title, body, created_at, posts.score / posts.num_raters as "rating" FROM posts
    ORDER BY id;`;
    const [posts] = await pool.query(query);
    // console.log(posts);
    return posts;
}

// פוסט מסויים
async function getCertainPost(postId) {
    const query = `SELECT posts.id, posts.userId, posts.topic,posts.subtopic, posts.title, posts.body, posts.created_at,
    posts.num_raters,
    posts.score / posts.num_raters as "rating" 
    FROM posts
    where id = ?`;
    const [[post]] = await pool.query(query, [postId]);
    // console.log(post);
    return post;
}

// פוסט מסויים
async function getCertainPost2(postId) {
    const query = `SELECT posts.id, posts.userId, posts.topic,posts.subtopic, posts.title, posts.body, posts.created_at,
    posts.num_raters,
    posts.score / posts.num_raters as "rating"
    ,users.username AS author 
    FROM posts
    where id = ?
    LEFT JOIN users ON posts.userId = users.id`; 
    
    const [[post]] = await pool.query(query, [postId]);
    // console.log(post);
    return post;
}

  
async function getCertainPost3(postId) {
    const query = `
    SELECT 
        posts.id, 
        posts.userId, 
        posts.topic,
        posts.subtopic, 
        posts.title, 
        posts.body, 
        posts.created_at, 
        posts.score / posts.num_raters as "rating", 
        GROUP_CONCAT(tags.name) AS tags,
        users.username AS author
    FROM 
        posts
    LEFT JOIN 
        tags ON posts.id = tags.postId 
    LEFT JOIN 
        users ON posts.userId = users.id 
    WHERE 
        posts.id = ?
    GROUP BY 
        posts.id;
    `;
    const [post] = await pool.query(query, [postId]);
    // console.log(post);
    return post;
}


// לפי כותרת
async function searchPostByTitle(title) {
    const query = `SELECT id, userId, title, body, created_at, posts.score / posts.num_raters as "rating" FROM posts
    WHERE title LIKE '${title}%';`;
    const [response] = await pool.query(query);
    return response;
}

// לפי מזהה
async function searchById(id) {
    const query = `SELECT id, userId, title, body, created_at, posts.score / posts.num_raters as "rating" FROM posts
    WHERE id LIKE '${id}%';`;
    const [response] = await pool.query(query);
    return response;
}

//UPDATE
// עריכה
async function editPost(postId, selectedBook, selectedPortion, title, body) {
    console.log("editPost in server", title);
    const query = `update posts set topic = ?,  subtopic = ?, title = ?, body = ?
    where id = ?`;
    const [response] = await pool.query(query, [selectedBook, selectedPortion, title, body, postId]);
    // console.log(response);
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
    const query2 = `UPDATE posts
        SET RatedByUsers = 
        CASE 
            WHEN RatedByUsers IS NULL THEN ?
            WHEN FIND_IN_SET(?, RatedByUsers) = 0 THEN CONCAT(RatedByUsers, ',?')
            ELSE RatedByUsers
        END
        WHERE id = ?`;
    // דירוג בפועל
    const [respons2] = await pool.query(query2, [userId, userId, userId, postId]);
    // בדיקת זהות מדרגים נוכחית
    const [respons3] = await pool.query('SELECT RatedByUsers FROM posts WHERE id = ?', [postId])
    // השוואה אם נוצר שינוי
    console.log(respons1[0].RatedByUsers, respons3[0].RatedByUsers);
    if (respons1[0].RatedByUsers != respons3[0].RatedByUsers) {
        // אם נוסף מדרג חדש משמע הוא רשאי לדרג - ניגש לדירוג
        const query4 = `UPDATE posts
        SET score = score + ?,
        num_raters = num_raters + 1
        WHERE id = ?`;
        // דירוג בפועל
        const [respons4] = await pool.query(query4, [newRating, postId]);
        if (respons4.affectedRows) {
            // החזרת פוסט מדורג
            const updatedPost = await getCertainPost(postId)
            return updatedPost;
        }
    }
    else return false;
}

//DELETE
// מחיקה
async function deletePost(postId) {
    const deletedPost = await getCertainPost(postId)
    const query = `delete from posts where id = ?`;
    const [response] = await pool.query(query, [postId]);
    return deletedPost;
}

async function deleteMultiplePosts(idsToDelete) {
    const query = `DELETE FROM posts WHERE id IN (?)`;
    const [response] = await pool.query(query, [idsToDelete]);
    console.log(response);
    return true;
}


async function test() {
    const data = await deleteMultiplePosts([89, 84, 5]);
    // const all = await addPost(4, "פרשת בראשית", "dsfgdsfgdfgdfgdf", "בראשית", "וירא");
    console.log(data);
}
// test()



module.exports = {
    getAllPosts,
    searchByTopic,
    getPostsOrderId,
    getPostsOrderTitle,
    getCertainPost,
    searchPostByTitle,
    searchById,
    addPost,
    editPost,
    updateRatingPost,
    deletePost,
    deleteMultiplePosts
};