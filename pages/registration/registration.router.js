const express = require("express");
const registrationRoute = express.Router();
const usersModule = require("../users/users.module");
const IAM = require("../../middlewares/monitoring");
const auth = require("../../middlewares/auth");
const bcrypt = require("bcrypt");
const {
  generateToken,
  generateTokenForNewUser,
} = require("../../middlewares/auth");
const {
  sendVerificationEmail,
  sendVerificationFailureEmail,
  sendVerificationTokenExpired,
  sendSuccessfulVerification,
} = require("../../verification");
const e = require("express");

// register
registrationRoute.post("/", IAM.handleNewUser, async (req, res) => {
  const name = req.body.name;
  const username = req.body.username;
  const phone = req.body.phone;
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 8);
  console.log("🚀 ~ registrationRoute.post ~ password:", password);

  try {
    const isExists = await usersModule.isUserExists(email);
    console.log(!!isExists);
    if (isExists) {
      res.status(400).send("כבר קיים משתמש עם אימייל זה");
      return;
    }
    const VerifiedToken = await generateTokenForNewUser(req.body.email);
    const response = await sendVerificationEmail(req.body.email, VerifiedToken);
    console.log(response.message);
    const newUser = await usersModule.createUser(
      name,
      phone,
      email,
      username,
      password
    );
    if (newUser) {
      res.json({ newUser, message: response.message });
      return;
    }
    res.status(404).send("תקלה לא מזוהה ביצירת משתמש");
  } catch (error) {
    res.status(500).send();
  }
});

// שליחת אימייל
registrationRoute.post("/verification", async (req, res) => {
  try {
    const VerifiedToken = await auth.generateTokenForNewUser(req.body.email);
    const message = await sendVerificationEmail(req.body.email, VerifiedToken);
    if (message) {
      res.status(200).send(message);
      return;
    }
    res.status(500).json("error: Verification failed");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// אימות אימייל
registrationRoute.get("/verify-email/:userEmail/:token", async (req, res) => {
  try {
    console.log(1);
    let verification = auth.verificationToken(req.params.token);
    console.log(2);
    if (verification.status === 404) {
      console.log(3);

      res.status(404).send(sendVerificationFailureEmail());
      console.log(4);
      return;
    }
    if (verification.status == 401) {
      console.log(5);
      const VerifiedToken = await auth.generateTokenForNewUser(
        req.params.userEmail
      );
      console.log(6);
      const message = await sendVerificationEmail(
        req.body.email,
        VerifiedToken
      );
      console.log(7);
      if (!message) {
        console.log(8);
        res.status(400).send(sendVerificationFailureEmail());
        return;
      }
      console.log(9);
      res.status(410).send(sendVerificationTokenExpired());
      return;
    }
    if (verification.status === 200) {
      console.log(10);
      console.log(verification.user.email);
      const activate = await usersModule.activateUser(verification.user.email);
      console.log(11);
      if (activate.status == 404) {
        console.log(12);
        res.status(404).send(sendVerificationFailureEmail());
        return;
      }
      console.log(13);
      res.status(200).send(sendSuccessfulVerification());
    }
  } catch (error) {
    console.log(14);
    console.error({ error });
    res.status(500).send(sendVerificationFailureEmail());
  }
});

registrationRoute.get("/check-username/:userName/", async (req, res) => {
  console.log(req.params.userName)
  try {
    const isExists = await usersModule.isUserNameExists(req.params.userName);
    if (!!isExists) {
      res.status(400).send("שם המשתמש תפוס");
      return;
    }
      res.status(200).send("שם המשתמש פנוי");
      return;
    }
   catch (error) {
    console.error(error);
    res.status(500).send("תקלה לא מזוהה בבדיקת שם משתמש");
  }
});

module.exports = registrationRoute;
