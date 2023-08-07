const express = require("express");
const app  =  express();
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const postRouter = require("./Router/PostRouter")

app.use(express.json());
mongoose.connect(process.env.MONGO_DATABASE_URL)
    .then((response) => {
        console.log("Connected to mongo DB successfully !!!!!");
    })
    .catch(error => {
        console.log("falied to Connect mongo DB!!!!", error);
    })

    app.use(fileUpload({
        useTempFiles:true
    }))

app.use("/post",cors(),postRouter);

app.listen(8080);

module.exports = app;