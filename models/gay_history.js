const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gayHistorySchema = new Schema({
    most_gay: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    least_gay: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    extreme_scores: [{
        type: Number,
        required: true,
    }],
    date: {
        type: String, 
        required: true
    },
    scores: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        score: {
            type: Number,
            required: true 
        }
    }],
});

const GayHistory = mongoose.model('GayHistory', gayHistorySchema);
module.exports = GayHistory;
