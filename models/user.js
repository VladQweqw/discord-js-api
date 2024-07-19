const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const user = new Schema({
    discord_id: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})

const User = mongoose.model("User", user);
module.exports = User;