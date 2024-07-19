const GayHistory = require("../models/gay_history");
const User = require("../models/user")

const get_gay_users = (req, res) => {
    GayHistory.find()
    .populate('history.most_gay')
    .populate("history.least_gay")
    .populate("history.scores.user")
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
    if(!b.users) return res.status(400).json({error: "No users provided"})

    let max = {
        value: -Infinity, user: ''
    }
    let min = {
        value: Infinity, user: ''
    }

    const scores = [];

    try {
        b.users.forEach(async (item) => {
            let user;

            try {
                user = await User.findOne({ discord_id: item.discord_id})
                if(!user) {
                    const user = new User({
                        discord_id: item.discord_id,
                        name: item.name
                    });

                    await user.save();
                }
                
                scores.push({
                    user: user._id,
                    score: item.gay_score
                })

                if(item.gay_score > max.value) {
                    max.value = item.gay_score;
                    max.user = user._id;
                }

                if(item.gay_score < min.value) {
                    min.value = item.gay_score;
                    min.user = user._id;
                }

            }catch(err) {
                return res.status(400).json({error: `Error while creating the user: ${item.name}`})
            }

        })

        try {
            let gayHistory = await GayHistory.findOne();
            if(!gayHistory) {
                gayHistory = new GayHistory()
            }
   
            gayHistory.history.push({
                most_gay: max.user,
                least_gay: min.user,
                date: b.date,
                extreme_scores: [max.value, min.value],
                scores,
            })
            await gayHistory.save();
    
            return res.status(200).json({detail: `User added to history, ${b.date}`})
        }
        catch(err) {
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