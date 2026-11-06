const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');

mongoose.connect("mongodb+srv://pjeffersondgl_db_user:3gcUqlQ9bYR2dTrJ@cluster0.iz5oq3k.mongodb.net/Passkey")
    .then(function () {
        console.log("database connected...");
    })
    .catch(function () {
        console.log("failed");
    });

const credential = mongoose.model("credential", {}, "Bulkmail");

app.use(cors());
app.use(express.json());

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