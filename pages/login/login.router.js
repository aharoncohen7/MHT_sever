const express = require("express");
const loginRoute = express.Router();
const auth = require("../../middlewares/auth");
const usersModule = require("../users/users.module");
const {
  sendPasswordResetEmail,
  sendFailureResetPassword,
  sendVerificationTokenExpiredForResetPass,
  sendSuccessfulResetPass,
} = require("../../verification");
const bcrypt = require("bcrypt");
const DEFAULT_PASS = process.env.DEFAULT_PASS;

// login
loginRoute.post("/", async (req, res) => {
  try {
    const check = await usersModule.checkUser(
      req.body.username,
      req.body.password
    );
    if (!check) {
      res.status(404).send("משתמש לא נמצא");
      return;
    }
    const user = await usersModule.getUser(parseFloat(check));
    if (user) {
      if (user.isAdmin == -1) {
        res.status(403).send("המערכת ממתינה לאישור כתובת האימייל שלך");
        return;
      }
      if (user.isAdmin == -2) {
        res.status(403).send("המערכת ממתינה לשחזור הסיסמה שלך");
        return;
      }
      if (user.isAdmin == -5) {
        res.status(404).send("משתמש לא קיים");
        return;
      }
      const token = await auth.generateToken(user);
      user.token = token;
      res.json(user);
      return;
    }
    res.status(404).send("Internal server error");
  } catch (error) {
    res.status(500).send("error.message: " + error.message);
  }
});

// שליחת אימייל
loginRoute.post("/forgot-password", async (req, res) => {
  try {
    const userId = await usersModule.isUserExists(req.body.requestedEmail);
    if (!userId) {
      res.status(404).send("כתובת האימייל שסיפקת לא קיימת במערכת");
      return;
    }
    const verifiedToken = auth.generateResetTokenForUser(
      req.body.requestedEmail
    );
    // if (!verifiedToken) {
    //   res.status(500).send("נסה שוב מאוחד יותר");
    //   return;
    // }
    console.log({ userId });
    const response = await usersModule.updateUser(
      { token: verifiedToken },
      userId
    );
    if (response.affectedRows < 1) {
      res.status(500).send("נסה שוב מאוחד יותר");
      return;
    }
    const message = await sendPasswordResetEmail(
      req.body.requestedEmail,
      verifiedToken
    );
    if (message) {
      res.status(200).send(message);
      return;
    }
    res.status(500).send("נסה שוב מאוחר יותר");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//  לאחר לחיצת יוזר על הקישור באימייל - איפוס
loginRoute.get("/reset-password/:userEmail/:token", async (req, res) => {
  try {
    console.log(1);
    let verification = auth.verificationToken(req.params.token);
    console.log(2);
    // אימות נכשל
    if (verification.status === 404) {
      console.log(3);
      res.status(404).send(sendFailureResetPassword());
      console.log(4);
      return;
    }
    const userId = await usersModule.isUserExists(req.params.userEmail);
    if (!userId) {
      res.status(404).send("כתובת האימייל בלינק אינה קיימת במערכת");
      return;
    }
    // כאשר פג תוקף קישור
    if (verification.status == 401) {
      console.log(5);
      const verifiedToken = await auth.generateTokenForNewUser(
        req.params.userEmail
      );
      console.log(6);
      console.log({ userId });
      const response = await usersModule.updateUser(
        { token: verifiedToken },
        userId
      );
      if (response.affectedRows < 1) {
        res.status(500).send("נסה שוב מאוחד יותר");
        return;
      }
      const message = await sendPasswordResetEmail(
        req.params.userEmail,
        verifiedToken
      );
      console.log(7);
      if (!message) {
        console.log(8);
        res.status(400).send(sendFailureResetPassword());
        return;
      }
      console.log(9);
      res.status(410).send(sendVerificationTokenExpiredForResetPass());
      return;
    }
    // אימות הצליח
    if (verification.status === 200) {
      console.log(10);
      console.log(verification.user.email);
      // השוואה
      const activate = await usersModule.checkToken(req.params.token, req.params.userEmail);
      console.log(11);
      if (!activate) {
        console.log(12);
        res.status(404).send(sendFailureResetPassword());
        return;
      } else {
        console.log(13);
        const password = DEFAULT_PASS;
        // const newPassword = bcrypt.hashSync(password, 8);
        // console.log("🚀 ~ loginRoute.get ~ newPassword:", newPassword)
        const response = await usersModule.changePassword(userId, password);
        console.log("🚀 ~ loginRoute.get ~ response:", response)
        
        if (response.affectedRows < 1) {
          res.status(500).send("נסה שוב מאוחד יותר");
          return;
        }
        res.status(200).send(sendSuccessfulResetPass());
      }
    }
  } catch (error) {
    console.log(14);
    console.error({ error });
    res.status(500).send(sendFailureResetPassword());
  }
});

// בדיקת טוקן
loginRoute.post("/checkToken", auth.validate, async (req, res) => {
  const user = {
    userId: req.body.userIdFromToken,
    isAdmin: req.body.isAdmin,
    userName: req.body.username,
  };
  res.status(200).send(user);
});

//כנראה לא פעיל
// בדיקת תוקף טוקן
loginRoute.post("/isTokenExpired", async (req, res) => {
  console.log("isTokenExpired");
  try {
    const expired = auth.isTokenExpired(req.body.token);
    if (expired) {
      console.log("הטוקן פג תוקף");
      res.status(400).send();
      return;
    }
    console.log("הטוקן בתוקף");
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = loginRoute;

// לא שמיש
// //Get a specific user - not available
// loginRoute.get("/:id",IAM.authenticate, async (req, res) => {
//     console.log(req.user.id, req.params.id);
//     try {
//         if (parseInt(req.user.id) === parseInt(req.params.id)) {
//             console.log("Success");
//             res.json(req.user);
//             return;
//         }
//         res.status(400).send();
//     } catch (error) {
//         console.log(error);
//         res.status(500).send(error);
//     }
// });

// // login
// loginRoute.post("/admin", async (req, res) => {
//     console.log("start login");
//     try {
//         const check = await usersModule.checkUser(req.body.username, req.body.password);
//         console.log(!!check);
//         if (!check) {
//             res.status(404).send("admin not found");
//             return;
//         }
//         const user = await IAM.getUser(parseFloat(check));
//         if (user) {
//             const token = await auth.generateToken({
//                 id: user.id,
//                 username: req.body.username,
//                 password: req.body.password,
//             })
//             user.token = token;
//             res.json(user);
//             return;
//         }
//         res.status(404).send("Internal server error");
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });
