const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected"))
    .catch((error) => console.error("Database connection failed:", error));

const credential = mongoose.model("credential", {}, "Bulkmail");

app.use(cors({
    origin: "https://bulkmail-sender-gray.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.get("/", (req, res) => {
    res.json({ message: "Bulk Mail Backend is running!" });
});

app.post("/mail", async function (req, res) {

    try {
        var msg = req.body.msg;
        var emailList = req.body.emailList;

        const data = await credential.find();

        console.log("Credentials found:", data.length);

if (data.length === 0) {
    throw new Error("No credentials found in Bulkmail collection");
}

console.log("Gmail user found:", data[0].user);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass
            }
        });

        for (let i = 0; i < emailList.length; i++) {

            await transporter.sendMail({
                from: data[0].toJSON().user,
                to: emailList[i],
                subject: "testing",
                text: msg
            });

            console.log("email sent to: " + emailList[i]);
        }

        res.send(true);

    }
    catch (error) {
        console.log(error);
        res.send(false);
    }

});



if (require.main === module) {
    app.listen(3000, function () {
        console.log("Server started...");
    });
}

module.exports = app;