const mongoos = require("mongoose");
const mongoURI = 'mongodb+srv://kaustabh:kaustabh@cluster0.rjnauqm.mongodb.net/inotebook';

const connectTomongo = async () => {

    try {
        await mongoos.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Connected to mongo");
    }

    catch (error) {
        console.log("Error Detected");
        console.log(error);
    }
}
module.exports = connectTomongo;
