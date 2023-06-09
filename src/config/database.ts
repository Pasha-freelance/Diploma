const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

export default function (): void {
// Connecting to the database
    mongoose
        .connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log("Successfully connected to database");
        })
        .catch((error: any) => {
            console.log("database connection failed. exiting now...");
            console.error(error);
            process.exit(1);
        });
}


