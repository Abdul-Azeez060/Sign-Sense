const express = require("express");
const app = express();
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");
const engine = require("ejs-mate");
app.engine("ejs", engine);
var serviceAccount = require("./key.json");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { log } = require("console");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.cookies.token) {
    console.log(req.cookies.token);
    // const user = jwt.verify(token, "abdjcdfsf34@");
    // console.log(user);
  } else {
    res.locals.user = null;
  }

  return next();
});

// Home Page
app.get("/", function (req, res) {
  res.render("Home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// Login Details Checking
app.post("/loginsubmit", async function (req, res) {
  const mail_id = req.body.email;
  const pass = req.body.pass;

  try {
    // Query the database directly for the email
    const userQuery = await db
      .collection("login_form")
      .where("email", "==", mail_id)
      .get();

    if (!userQuery.empty) {
      // Check if the password matches
      const user = userQuery.docs[0].data();
      if (user.password === pass) {
        const token = jwt.sign({ user }, "abdjcdfsf34@");
        res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.render("./Home.ejs");
      } else {
        return res.render("./unsuccessful.ejs");
      }
    } else {
      return res.render("./unsuccessful.ejs");
    }
  } catch (error) {
    console.error("Unable to acquire data from the database:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Adding New Users to Database
app.post("/signupsubmit", async function (req, res) {
  const mail_id = req.body.email;
  const pass = req.body.pass;

  try {
    // Check if the user already exists
    const existingUserQuery = await db
      .collection("login_form")
      .where("email", "==", mail_id)
      .get();

    if (!existingUserQuery.empty) {
      return res.render("unsuccessful.ejs");
    } else {
      // If user does not exist, add new user
      const user = await db.collection("login_form").add({
        email: mail_id,
        password: pass,
      });
      console.log(user);
      const token = jwt.sign({ user }, "abdjcdfsf34@");
      res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
      return res.render("Home.ejs");
    }
  } catch (error) {
    console.error("Unable to store data into the database:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, function () {
  console.log("Server is running on http://localhost:3000/");
});
