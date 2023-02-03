const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();

const MongoDBURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mydb';
mongoose.set('strictQuery', false);
mongoose.connect(MongoDBURI, {
  useNewUrlParser: true
});
console.log("connexion à la base de données")
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("connexion avec la base de données établie")
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,

  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));


app.use("/", require("./router/index"))
app.use("/login", require("./router/login"))
app.use("/register", require("./router/register"))
app.use("/logout", require("./router/logout"))
app.use("/forgetpass", require("./router/forgetpass"))
app.use("/profile", require("./router/profile"))


app.use("/404", require("./router/404"))

  

app.get("*", function(req, res) {
  res.redirect("/404");
});
app.listen(process.env.PORT || 3000, () => {
  console.log('Le site est lancé sur le port : ' + process.env.PORT);
});


