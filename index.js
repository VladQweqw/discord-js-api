const express = require('express');
const app = express()

const mongoose = require("mongoose")

const PORT = 8080;
const dbURI = "mongodb+srv://vladpoienariu:admin123@lists.5vhezvm.mongodb.net/discord?retryWrites=true&w=majority&appName=lists";

const gayRoutes = require("./routes/gay_route")

mongoose.connect(dbURI).then((result) => {
    app.listen(PORT, () => console.log(`Alive on http://localhost:${PORT}`))

    console.log('Connected to db');
}).catch((err) => {
    console.log(`Error connecting to db: ${err}`);
})


app.use(express.json())
app.use('/', gayRoutes);