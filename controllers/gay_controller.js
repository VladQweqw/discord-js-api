const GayHistory = require("../models/gay_history");
const User = require("../models/user")

const get_gay_users = (req, res) => {
    let limit = parseInt(req.query.limit) || 3;
    limit = Math.min(limit, 3);

    GayHistory.find()
    .limit(limit)
    .populate('most_gay')
    .populate("least_gay")
    .populate("scores.user")
    .then((result) => {
        if(req.query.reverse === 'true') {
            result = result.reverse()
        }

        res.json({
            data: result
        })
    })
    .catch((err) => {
        res.status(400).json({
            error: `Error while fetching data: ${err}`
        })
    })
    
}

const get_gay_users_by_date = async (req, res) => {
    let date = req.params.date

    console.log(date);

    if(!date) res.status(400).json({
        error: "Invalid date"
    })

    if(req.params.date === 'prev') {
        const date = new Date();

        const format_date = `${date.getDate() - 1}-${date.getMonth() + 1}-${date.getFullYear()}`
        date = format_date;
    }
    
    await GayHistory.findOne({date: date})
    .populate('most_gay')
    .populate("least_gay")
    .populate("scores.user")
    .then((result) => {
        res.json({
            data: result
        })
    })
    .catch((err) => {
        res.status(400).json({
            error: `Error while fetching data: ${err}`
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
        await Promise.all(b.users.map(async (item) => {
            let user;

            try {
                user = await User.findOne({ discord_id: item.discord_id})
                if(!user) {
                    const user = User.create({
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
        }))
        
        const date = new Date();
        const formated_Date = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` 

        try {
            let gayHistory = new GayHistory({
                most_gay: max.user,
                least_gay: min.user,
                date: formated_Date,
                extreme_scores: [max.value, min.value],
                scores,
            })
            await gayHistory.save();
            return res.status(200).json({detail: `Entry added to history, ${formated_Date}`})
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
    post_gay_users,
    get_gay_users_by_date
}