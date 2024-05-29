const cors = require("cors");
// const { authenticate } = require('./middlewares/monitoring');
const { validate } = require('./middlewares/auth');
const express = require("express");
require("dotenv").config();
const app = express();

const loginRoute = require("./pages/login/login.router");
const registrationRoute = require("./pages/registeration/registeration.router");
const usersRoute = require("./pages/users/users.router");
const postsRoute = require("./pages/posts/posts.router");
const commentsRoute = require("./pages/comments/comments.router");
const tagsRoute = require("./pages/tags/tags.router");


// app.get('/', (req, res) => {
//   res.sendFile('../clientPro7/my-app/build/index.html')
// })

app.use(cors());
app.use(express.json());
// app.use(express.static('../clientPro7/my-app/build'))
app.use("/api/login", loginRoute);
app.use("/api/registration", registrationRoute);
app.use("/api/users", validate, usersRoute);
app.use("/api/posts",
//  validate,
  postsRoute);
app.use("/api/tags",
//  validate,
  tagsRoute);
app.use("/api/comments",validate, commentsRoute);

const port = process.env.PORT || 4002;

// console.log(process.env.PORT);

app.listen(port, () => {
    console.log("server is running on port " + port);
});
