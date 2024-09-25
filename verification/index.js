const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const CLIENT_HOST = process.env.CLIENT_HOST;
const SERVER_HOST = process.env.SERVER_HOST;
const GMAIL_USERNAME = process.env.GMAIL_USERNAME;
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;

// יצירת מחולל מיילים
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: GMAIL_USERNAME,
    pass: GMAIL_PASSWORD,
  },
});

async function sendVerificationEmail(userEmail, VerifiedToken) {
  const verificationLink = `${SERVER_HOST}/api/registration/verify-email/${userEmail}/${VerifiedToken}`;
  const mailOptions = {
    from: GMAIL_USERNAME,
    to: userEmail,
    subject: "Vortly - אשר את כתובת המייל שלך",
    html: `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>אימות חשבון</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            text-align: center;
        }
        .container {
            max-width: 600px;
            text-align: center;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 5px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            direction: rtl;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #2980b9;
        }
        .footer {
            margin-top: 30px;
            font-size: 0.9em;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>ברוכים הבאים לאתר וורטלי! אנא אמתו את חשבונכם</h1>
        <p>תודה שהצטרפתם לאתר שלנו. כדי להשלים את תהליך ההרשמה, אנא לחצו על הכפתור למטה לאימות כתובת הדוא"ל שלכם:</p>
        <a href="${verificationLink}" class="button">אמת את החשבון</a>
        <p>אם לא נרשמתם לאתר שלנו, אנא התעלמו מהודעה זו.</p>
        <div class="footer">
            <p>בברכה,<br>צוות האתר</p>
        </div>
    </div>
</body>
</html>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { message: "Email sent: " + info.response };
  } catch (error) {
    console.error("Error sending email: " + error);
    throw "Error sending email";
  }
}

const sendVerificationFailureEmail = () => `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>כשל באימות חשבון</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            text-align: center;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 5px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #e74c3c;
            margin-bottom: 20px;
        }
        .icon {
            width: 100px;
            height: 100px;
            margin: 0 auto 20px;
        }
        .icon .circle {
            stroke: #e74c3c;
            stroke-width: 6;
            fill: none;
            animation: draw-circle 1s ease-out forwards;
        }
        .icon .cross {
            stroke: #e74c3c;
            stroke-width: 6;
            stroke-linecap: round;
            fill: none;
            animation: draw-cross 1s ease-out forwards;
        }
        @keyframes draw-circle {
            0% { stroke-dasharray: 0 314; }
            100% { stroke-dasharray: 314 314; }
        }
        @keyframes draw-cross {
            0% { stroke-dasharray: 0 90; }
            100% { stroke-dasharray: 90 90; }
        }
        .footer {
            margin-top: 30px;
            font-size: 0.9em;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>אימות החשבון נכשל</h1>
        <svg class="icon" viewBox="0 0 100 100">
            <circle class="circle" cx="50" cy="50" r="45"></circle>
            <line class="cross" x1="30" y1="30" x2="70" y2="70"></line>
            <line class="cross" x1="70" y1="30" x2="30" y2="70"></line>
        </svg>
        <p>לצערנו, לא הצלחנו לאמת את כתובת הדוא"ל שלך.</p>
        <p>ייתכן שהקישור לאימות פג תוקף, או שהייתה בעיה טכנית בתהליך האימות.</p>
        <p>בבקשה נסה/י שוב או פנה/י לתמיכה לקבלת עזרה.</p>
        <div class="footer">
            <p>בברכה,<br>צוות האתר</p>
        </div>
    </div>
</body>
</html>`;

const sendVerificationTokenExpired = () => `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>תוקף הקישור פג</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            text-align: center;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 5px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #e74c3c;
            margin-bottom: 20px;
        }
        .icon {
            width: 100px;
            height: 100px;
            margin: 0 auto 20px;
        }
        .icon .circle {
            stroke: #e74c3c;
            stroke-width: 6;
            fill: none;
            animation: draw-circle 1s ease-out forwards;
        }
        .icon .cross {
            stroke: #e74c3c;
            stroke-width: 6;
            stroke-linecap: round;
            fill: none;
            animation: draw-cross 1s ease-out forwards;
        }
        @keyframes draw-circle {
            0% { stroke-dasharray: 0 314; }
            100% { stroke-dasharray: 314 314; }
        }
        @keyframes draw-cross {
            0% { stroke-dasharray: 0 90; }
            100% { stroke-dasharray: 90 90; }
        }
        .footer {
            margin-top: 30px;
            font-size: 0.9em;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>אימות החשבון נכשל</h1>
        <svg class="icon" viewBox="0 0 100 100">
            <circle class="circle" cx="50" cy="50" r="45"></circle>
            <line class="cross" x1="30" y1="30" x2="70" y2="70"></line>
            <line class="cross" x1="70" y1="30" x2="30" y2="70"></line>
        </svg>
        <p>לצערנו, הקישור שבו השתמשת פג תוקף.</p>
        <p>שלחנו אליך מייל נוסף עם קישור חדש, עליך לאשר את כתובת הדוא"ל תוך 15 דקות.</p>
        <p>אם לא קיבלת את המייל, אנא פנה/י לתמיכה.</p>
        <div class="footer">
            <p>בברכה,<br>צוות האתר</p>
        </div>
    </div>
</body>
</html>`;

// const htmlForVerification2 = ()=> `<!DOCTYPE html>
// <html lang="he" dir="rtl">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>אימות הושלם בהצלחה</title>
//     <style>
//         body {
//             font-family: Arial, sans-serif;
//             line-height: 1.6;
//             color: #333;
//             background-color: #f4f4f4;
//             margin: 0;
//             padding: 0;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             height: 100vh;
//             text-align: center;
//         }
//         .container {
//             background-color: #ffffff;
//             border-radius: 5px;
//             padding: 30px;
//             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//             max-width: 400px;
//         }
//         h1 {
//             color: #2ecc71;
//             margin-bottom: 20px;
//         }
//         .success-icon {
//             font-size: 48px;
//             color: #2ecc71;
//             margin-bottom: 20px;
//         }
//         .button {
//             display: inline-block;
//             padding: 10px 20px;
//             background-color: #3498db;
//             color: #ffffff;
//             text-decoration: none;
//             border-radius: 5px;
//             font-weight: bold;
//             margin-top: 20px;
//         }
//         .button:hover {
//             background-color: #2980b9;
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <div class="success-icon">✔</div>
//         <h1>אימות הושלם בהצלחה!</h1>
//         <p>תודה שאימתת את כתובת הדוא"ל שלך. החשבון שלך פעיל כעת.</p>
//         <a href="${CLIENT_HOST}/login" class="button">התחבר לחשבון שלך</a>
//     </div>
// </body>
// </html>`

const sendSuccessfulVerification = () => `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>אימות הושלם בהצלחה</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
        }

        .container {
            background-color: #ffffff;
            border-radius: 5px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 400px;
        }

        h1 {
            color: #2ecc71;
            margin-bottom: 20px;
        }

        .logo {
            width: 160px;
            height: 160px;
            margin-bottom: 20px;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
        }

        .button:hover {
            background-color: #2980b9;
        }

        .circle {
            fill: none;
            stroke: #4CAF50;
            stroke-width: 2;
            stroke-dasharray: 283;
            stroke-dashoffset: 283;
            animation: circle-draw 2s ease forwards;
        }

        .check {
            fill: none;
            stroke: #4CAF50;
            stroke-width: 2;
            stroke-dasharray: 80;
            stroke-dashoffset: 80;
            animation: check-draw 1s ease forwards 1s;
        }

        @keyframes circle-draw {
            to {
                stroke-dashoffset: 0;
            }
        }

        @keyframes check-draw {
            to {
                stroke-dashoffset: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="circle" cx="26" cy="26" r="25" />
            <path class="check" fill="none" d="M16 26l9 9 14-14"/>
        </svg>
        <h1>אימות הושלם בהצלחה!</h1>
        <p>תודה שאימתת את כתובת הדוא"ל שלך. החשבון שלך פעיל כעת.</p>
        <a href="${CLIENT_HOST}/login" class="button">התחבר לחשבון שלך</a>
    </div>
</body>
</html>
`;

module.exports = {
  sendVerificationEmail,
  sendSuccessfulVerification,
  sendVerificationFailureEmail,
  sendVerificationTokenExpired,
};

// // במקרה של שחזור סיסמה
// const resetToken = generateResetTokenForUser(user);
// await sendPasswordResetEmail(user.email, resetToken);
