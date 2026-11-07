
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://bulkmail-sender-gray.vercel.app"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Check backend
app.get("/", (req, res) => {
    res.json({
        message: "Bulk Mail Backend is running!"
    });
});

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Backend is working!"
    });
});

// Gmail transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// Send emails
app.post("/mail", async (req, res) => {
    try {
        const { msg, emailList } = req.body;

        if (!msg || !Array.isArray(emailList) || emailList.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Message and email list are required"
            });
        }

for (const recipient of emailList) {
    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: recipient,
        subject: "Bulk Mail Sender",
        text: msg
    });

    console.log("Email sent to:", recipient);
}

res.send(true);

} catch (error) {
    console.error("Email sending error:", error.message);

    res.status(500).send(false);
}
});

// Local server
if (require.main === module) {
    app.listen(3000, () => {
        console.log("Server started on port 3000");
    });
}

module.exports = app;
