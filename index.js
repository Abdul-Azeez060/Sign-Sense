const express = require('express');
const app = express();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

var serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public_css'));
app.use(express.static('public_js'));
app.use(express.static('images'));
app.use(express.static('assets'));

// Home Page
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/login.html");
});

// Login Details Checking
app.post('/loginsubmit', async function (req, res) {
    const mail_id = req.body.email;
    const pass = req.body.pass;

    try {
        // Query the database directly for the email
        const userQuery = await db.collection("login_form").where("email", "==", mail_id).get();

        if (!userQuery.empty) {
            // Check if the password matches
            const user = userQuery.docs[0].data();
            if (user.password === pass) {
                return res.sendFile(__dirname + "/index.html");
            } else {
                return res.sendFile(__dirname + "/unsuccessful.html");
            }
        } else {
            return res.sendFile(__dirname + "/unsuccessful.html");
        }
    } catch (error) {
        console.error("Unable to acquire data from the database:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Adding New Users to Database
app.post('/signupsubmit', async function (req, res) {
    const mail_id = req.body.email;
    const pass = req.body.pass;

    try {
        // Check if the user already exists
        const existingUserQuery = await db.collection("login_form").where("email", "==", mail_id).get();

        if (!existingUserQuery.empty) {
            return res.sendFile(__dirname + "/unsuccessful.html");
        } else {
            // If user does not exist, add new user
            await db.collection("login_form").add({
                email: mail_id,
                password: pass
            });
            return res.sendFile(__dirname + "/index.html");
        }
    } catch (error) {
        console.error("Unable to store data into the database:", error);
        return res.status(500).send("Internal Server Error");
    }
});

app.listen(3000, function () {
    console.log("Server is running on http://localhost:3000/");
});
