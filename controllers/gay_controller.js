const GayHistory = require("../models/gay_history");
const User = require("../models/user")

const get_gay_users = (req, res) => {
    GayHistory.find()
    .populate('history.user')
    .then((result) => {
        res.json({
            data: result
        })
    })
    .catch((err) => {
        res.status(400).json({
            error: err
        })
    })
    
}

async function post_gay_users(req, res) {
    const b = req.body;
    if(!b.discord_id) return res.status(400).json({error: "No discord id provided"})
    
    try {
        let user;
        
        try {
            user = await User.findOne({ discord_id: b.discord_id})
            if(!user) {
                const user = new User({
                    discord_id: b.discord_id,
                    streak: b.streak,
                    date: b.date,
                    name: b.name
                });
                await user.save();
            }
            // console.log("User:", user);
            
        } catch(err) {
            return res.status(400).json({error: "Error while creating the user"})
        }
    
        try {
            let gayHistory = await GayHistory.findOne();
            if(!gayHistory) {
                gayHistory = new GayHistory()
            }
            
            gayHistory.history.push({user: user._id, score: b.gay_score})
            await gayHistory.save();
    
            return res.status(200).json({detail: "User added to history", history: gayHistory})
        } catch(err) {
            return res.status(400).json({error: "Error while adding the user to history"})
        }

    } catch(err) {
        return res.status(500).json({error: "Unexpected error"})
    }
}

module.exports = {
    get_gay_users,
    post_gay_users
}