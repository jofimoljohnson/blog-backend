const express = require("express");
const mongoose = require("mongoose");
const cors=require('cors')

const router = require("./routes/user-routes");
const blogRouter = require("./routes/blog-routes");

const app = express();
app.use(cors())
// middleware
app.use(express.json()); //this step will help what type of data we are send

app.use("/api/user", router);
app.use("/api/blog",blogRouter)




mongoose
    .connect(
        "mongodb+srv://admin:q49TE9T3Cv1RsuxB@cluster0.ovcwk0i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => app.listen(5000))
    .then(() => console.log("Connected to Database and listening to localhost 5000 "))
    .catch((err) => console.log(err));
