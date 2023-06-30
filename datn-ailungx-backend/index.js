const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const apiRoute = require('./routes/api');

const app = express()
dotenv.config();

//Mongodb connection
mongoose.set("strictQuery",true);
mongoose.connect(process.env.MONGODB_URL, () => 
    {
        console.log("Connected to Mongo");
    });

app.use(cors());
app.use(cookieParser());
// app.use(express.json());
app.use(express.json({limit: '25mb'}));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public")); 
app.get('/', (req, res) => {
    res.send('Welcome to AI LungX!');
  })
console.log("Welcome to");
app.post('/testpost', (req, res) => {
    res.send(req.body.test);
})
app.use("/api", apiRoute);

const host = '0.0.0.0';
const port = 5000;
app.listen(port, host, () => console.log(`Example app listening on port ${port}!`));



