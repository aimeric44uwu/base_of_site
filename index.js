const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const https = require('https');
const http = require('http');
const MongoStore = require('connect-mongo')(session);
const fs = require('fs');

require('dotenv').config();

const Port = process.env.PORT;
const MongoDBURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mydb';

mongoose.set('strictQuery', false);

mongoose.connect(MongoDBURI, {
   dbName: process.env.DB_NAME,
   useUnifiedTopology: true,
   useNewUrlParser: true
});

console.log("connexion à la base de données ... ")

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

if (process.env.ENABLE_SSL == 'true') {

  const privateKey = fs.readFileSync(__dirname + '/certsFiles/privkey.pem', 'utf8');
  const certificate = fs.readFileSync(__dirname + '/certsFiles/cert.pem', 'utf8');
  const ca = fs.readFileSync(__dirname + '/certsFiles/chain.pem', 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(Port, () => {
    console.log('HTTPS Server running on port ' + Port);
  });
} else {

  const httpServer = http.createServer(app);

  httpServer.listen(Port, () => {
    console.log('HTTP Server running on port ' + Port);
  });
}
