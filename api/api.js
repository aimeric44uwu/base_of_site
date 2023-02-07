const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const fs = require('fs');

require('dotenv').config({ path: '../.env' });

var Port = process.env.API_PORT;
if(!Port) {
    Port = 3000;
}
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
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.BASE_URL.slice(0, -1));
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // httpOnly: true,
    // secure: true,
    // ephemeral: true,
    // cookie: { maxAge: 1000 * 60 * 60 * 24 },
  
    store: new MongoStore({
      mongooseConnection: db
    })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('../public'));


app.use("/", require("./index-api"))
app.get('/404', async (req, res, next) => {
	return res.status(404);
})
app.get("*", function(req, res) {
  res.redirect("/404");
});

if (process.env.ENABLE_SSL == 'true') {

    const privateKey = fs.readFileSync('../certsFiles/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('../certsFiles/cert.pem', 'utf8');
    const ca = fs.readFileSync('../certsFiles/chain.pem', 'utf8');
  
    const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca
    };
  
    const httpsServer = https.createServer(credentials, app);
  
    httpsServer.listen(Port, () => {
      console.log('HTTPS api running on port ' + Port);
    });
  } else {
  
    const httpServer = http.createServer(app);
  
    httpServer.listen(Port, () => {
      console.log('HTTP api running on port ' + Port);
    });
  }
  