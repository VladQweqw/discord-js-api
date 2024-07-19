const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gayHistorySchema = new Schema({
    history: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        score: {
            type: Number,
        }
    }],
});

const GayHistory = mongoose.model('GayHistory', gayHistorySchema);
module.exports = GayHistory;
