require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");
const { connectCloudinary } = require("./src/config/cloudinary");
const dns = require("dns");
const axios = require("axios");

const url = process.env.SERVER_URL;
const interval = 30000;

function reloadWebsite() {
  axios
    .get(url)
    .then((response) => {
      console.log("Website reloaded");
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
    });
}

setInterval(reloadWebsite, interval);








// Change DNS servers
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {

        app.listen(PORT, () => {
            console.log(` Server is running on port ${PORT}`);
        });
         await connectDB();
        connectCloudinary();
    } catch (error) {
        console.error(" Failed to start server:", error);
        process.exit(1);
    }
};

startServer();