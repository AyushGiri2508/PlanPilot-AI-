const mongoose = require("mongoose")



async function connectDB() {

    try {
        await mongoose.connect(process.env.MONGODB_URL)

        console.log("Connected to Database")
    }
    catch (err) {
       console.error("Database Connection Error");
       console.error(err);
    }
}

module.exports = connectDB