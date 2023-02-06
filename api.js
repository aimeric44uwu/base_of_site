const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();

const Port = process.env.PORT;
const MongoDBURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mydb';

mongoose.set('strictQuery', false);

mongoose.connect(MongoDBURI, {
   dbName: process.env.DB_NAME,
   useUnifiedTopology: true,
   useNewUrlParser: true
});

console.log("connexion à la base de données ...")

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log("connexion avec la base de données établie")
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", require("./api/index"))
app.use("/login", require("./api/login"))
app.use("/register", require("./api/register"))
app.use("/logout", require("./api/logout"))
app.use("/forgetpass", require("./api/forgetpass"))
app.use("/profile", require("./api/profile"))

app.use("/404", require("./api/404"))

app.get("*", function(req, res) {
  res.redirect("/404");
});

