const http = require('http');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const MongoClient = require('mongodb');

const MONGODB_URI= "mongodb://localhost:27017/posts";

const app = express();

app.locals.pretty = true;
app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
  proxy: true,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ url: MONGODB_URI })
  })
);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.get('/', (req, res) => {
 res.render('home', { title: 'Blog - Coding Bull' });
});

app.get('/posts', (req, res) => {
  db.collection(COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, (error, doc) => {
    if (error) {
      handleError(res, error.message, 'Failed to get posts', 404);
    } else {
      res.status(200).json({
        id: doc._id,
        name: doc.title,
        phone: doc.description
      });
    }
  })
});

app.post('/posts', (req, res) => {
  const { body }  = req;

  if (!(body.title || body.description)) {
    handleError(res, "Invalid user input", "Must provide title and description.", 400);
    return;
  }

  db.collection(COLLECTION).insertOne(body, (error, doc) => {
    if (error) {
      handleError(res, error.message, 'Failed to create post');
    } else {
      res.status(201).json(doc.ops[0]);
    }
  })
});
