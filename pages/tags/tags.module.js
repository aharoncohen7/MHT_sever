const pool = require('../../DL/db');

// get tag by id
async function getTag(id) {
    const SQL = `select name from tags where id = ?`;
    const [[tag]] = await pool.query(SQL,[id]);
    return tag.name;
}


// כל התגים
async function getAllTags() {
    const SQL = `select * from tags`;
    const [tags] = await pool.query(SQL);
    // console.log(tags);
    return tags;
}
// כל התגיות של פוסט מסויים
async function getTagsByPostId(postId) {
    const SQL = `select * from tags
    where postId = ?`;
    const [tags] = await pool.query(SQL, [postId]);
    // console.log(tags);
    return tags;
}


//צירוף וקישור תגיות לפוסט
async function addTagsToPost(postId, tags) {
    let all = [];
  
    const SQL = `
      INSERT INTO tags (postId, name)
      VALUES (?, ?)
    `;
  
    for (let item of tags) {
      const [tag] = await pool.query(SQL, [postId, item]);
      const newTag = await getTag(tag.insertId)
      all.push(newTag);
    }
  
    return all;
  }
  


async function test(){
    // const data = await addTagsToPost(107, ["בראשית", "ויחי", "יעקב אבינו", "יוסף"]);
    const tag = await getTagsByPostId(107)
    console.log(tag);

}
// test()





module.exports = {
    getTag,
    getAllTags,
    getTagsByPostId,
    addTagsToPost
};