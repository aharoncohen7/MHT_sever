const pool = require("../../DL/db");

// get tag by id
async function getTag(id) {
  const SQL = `select name from tags where id = ?`;
  const [[tag]] = await pool.query(SQL, [id]);
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
  console.log(tags);
  return tags;
}

//צירוף וקישור תגיות לפוסט
async function addTagsToPost(postId, tags) {
  let all = [];

  // const SQL = `
  //   INSERT INTO tags (postId, name)
  //   VALUES (?, ?)
  // `;

  // const SQL = `
  //   INSERT  IGNORE INTO tags (postId, name)
  //   VALUES (?, ?)
  // `;

  // const SQL = `
  //   INSERT INTO tags (postId, name)
  //   VALUES (?, ?)
  // `;

  // const SQL = `
  // INSERT INTO tags (postId, name)
  // VALUES ?, ?
  // WHERE NOT EXISTS (
  // SELECT 1 FROM tags WHERE postId = ? AND name = ?)
  // `;
  //   const SQL = `
  //   INSERT INTO tags (postId, name)
  // SELECT 387, 'סוכות'
  // WHERE NOT EXISTS (
  //   SELECT 1 FROM tags WHERE postId = 387 AND name = 'סוכות'
  // )
  //   const SQL = `
  //   INSERT INTO tags (postId, name)
  // SELECT ?, ?
  // WHERE NOT EXISTS (
  //   SELECT 1 FROM tags WHERE postId = ? AND name = ?
  // )
  //   `;
  //     const SQL = `
  //     INSERT INTO tags (postId, name)
  // SELECT * FROM (SELECT ? AS postId, ? AS name) AS tmp
  // WHERE NOT EXISTS (
  //   SELECT 1 FROM tags WHERE postId = ? AND name = ?
  // )
  //     `;
  //     const SQL = `
  //     INSERT INTO tags (postId, name)
  // SELECT ?, ?
  // FROM dual
  // WHERE NOT EXISTS (
  //   SELECT 1 FROM tags WHERE postId = (SELECT ?) AND name = (SELECT ?)
  // )
  // )
  //     `;
  //   const SQL = `
  //    INSERT INTO tags (postId, name)
  // SELECT ?, ?
  // FROM DUAL
  // WHERE NOT EXISTS (
  //   SELECT 1 FROM tags WHERE postId = ? AND name = ?
  // );

  //     `;
  //   const SQL = `
  //       INSERT INTO tags (postId, name)
  // SELECT ? AS postId, ? AS name
  // FROM dual
  // WHERE NOT EXISTS (
  //   SELECT 1 FROM tags WHERE postId = ? AND name = ?
  // )
  //       `;

  // for (let item of tags) {
  //   const [tag] = await pool.query(SQL, [postId, item]);
  //   const newTag = await getTag(tag.insertId);
  //   all.push(newTag);
  // }
  for (let item of tags) {
    console.log("➡️➡️➡️", item);
    const [tag] = await pool.query(
      `
         INSERT INTO tags (postId, name)
         SELECT ${postId}, '${item}'
        WHERE NOT EXISTS (
        SELECT 1 FROM tags WHERE postId = ${postId} AND name = '${item}')
    `,

      [postId, item]
    );
    if (tag.insertId) {
      const newTag = await getTag(tag.insertId);
      all.push(newTag);
    }
  }

  return all;
}

async function test() {
  // const data = await addTagsToPost(107, ["בראשית", "ויחי", "יעקב אבינו", "יוסף"]);
  const tag = await getTagsByPostId(107);
  console.log(tag);
}
// test()

module.exports = {
  getTag,
  getAllTags,
  getTagsByPostId,
  addTagsToPost,
};
