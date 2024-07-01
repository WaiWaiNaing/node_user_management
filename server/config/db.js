const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connectDB = async() => {
    try{
        const connt = await mongoose.connect(process.env.DB_URL);
        console.log(`Connected : ${connt.connection.host}`);
    }catch(err){
        console.log(err);
    }
}

module.exports = connectDB;