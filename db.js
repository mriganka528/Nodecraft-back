const mongoos = require("mongoose");
const mongoURI =  "mongodb+srv://mriganka:Mriganka1234@cluster0.1sw0ohe.mongodb.net/?retryWrites=true&w=majority";

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