const mongoose = require("mongoose");

module.exports = {
    dbConnect: async () => {
        try{
            await mongoose
            .connect("mongodb://127.0.0.1:27017/ChatApp")
            .then(() => {
                console.log("MongoDB Connected Successfully");
            });
        } catch(error){
            console.log(error);
        }
    }
};