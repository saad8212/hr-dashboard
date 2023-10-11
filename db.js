require('dotenv').config();
const mongoose = require("mongoose");
const dbconfig = mongoose.set("strictQuery", false);
const db = 'mongodb+srv://saad:saad8212@cluster0.irhxo3y.mongodb.net/dashboard?tls=true';

mongoose.connect(db, {
   
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then((res) => {
        console.log("database connection established");
    })
    .catch((err) => {
        console.log("error connecting to database, ", err);
    });
module.export = { dbconfig };

