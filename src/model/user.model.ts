const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    userId: { type: String, require: true },
});

export default model("user", userSchema);
