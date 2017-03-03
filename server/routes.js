const errorHandler = require('errorhandler');
const { MongoClient, ObjectID } = require('mongodb');
const moment = require('moment');

module.exports = function(app) {

	try {
	  const env = require('dotenv');
	  env.config({ silent: true });
	}
	catch(e) {

	}

	let db;
	const COLLECTION = "posts";

	MongoClient.connect(process.env.MONGODB_URI, (error, database) => {

	  if (error) {
	    console.log('There was an error while trying to connect to the database.', error);
	    process.exit(1);
	  }

	  console.log('Successfully connected to MongoDB.');

	  db = database;

		const getPosts = (callback) => {
		  db.collection(COLLECTION).find({}, { "sort" : ['title', 'asc'] }).toArray((error, docs) => {
		    if (error) callback(error)
		    else callback(null, docs)
		  });
		};

		const handleError = (res, reason, message, code) => {
		  console.log('Error: %s', reason);
		  res.status(code || 500).json({ error: message });
		};

		const fetchPosts = (docs) => {
			let posts = [];
	    docs.forEach(doc => {
	      posts.push({
	        id: doc._id,
	        title: doc.title,
	        description: doc.description,
	        date: doc.date
	      });
	    });
	    return posts;
		};

		app.get('/', (req, res) => {
		  getPosts(function(error, docs) {
		    res.render('home', {
		      title: 'The NodeJs Blog',
		      posts: fetchPosts(docs)
		    });
		  })
		});

		app.get('/posts', (req, res) => {
		  getPosts(function(error, docs) {
		    res.status(200).json(fetchPosts(docs));
		  })
		});

		app.get('/posts/new', (req, res) => {
		  res.render('posts/new', { title: 'Blog - Coding Bull' });
		});

		app.post('/posts', (req, res) => {
		  const { body }  = req;

		  if (!(body.title || body.description)) {
		    handleError(res, "Invalid post input", "<b>Invalid post input:</b> Must provide <u>Title</u> and <u>Description</u>.", 400);
		    return;
		  }
		  if ((body.title == '' || body.description == '')) {
		    handleError(res, "Invalid post input", "<b>Invalid post input:</b> Must provide <u>Title</u> and <u>Description</u>.", 400);
		    return;
		  }

		  const post = {
		  	title: body.title,
		  	description: body.description,
		  	date: moment().format('MMMM Do YYYY, h:mm:ss a')
		  }

		  db.collection(COLLECTION).insertOne(post, (error, doc) => {
		    if (error) {
		      handleError(res, error.message, '<b>Error:</b> Failed to create post');
		      return;
		    } else {
		      res.status(200).json({ success: "<b>Success</b>: Post created Successfully" });
		      return;
		    }
		  })
		});

		app.get('*', (req, res) => { res.render('404', { title: 'Page Not Found'}); });

	});

};