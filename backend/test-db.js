require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 15000,
            family: 4
        });

        console.log("MongoDB connected successfully!");

        await mongoose.connection.db.admin().ping();
        console.log("MongoDB ping successful!");

    } catch (error) {
        console.log("\nMAIN ERROR:");
        console.log(error.message);

        console.log("\nSERVER DETAILS:");

        if (error.reason?.servers) {
            for (const [host, server] of error.reason.servers) {
                console.log("\nHost:", host);
                console.log("Server type:", server.type);
                console.log("Error:", server.error?.message || "No error details");
            }
        }
    } finally {
        await mongoose.disconnect().catch(() => {});
    }
}

testConnection();