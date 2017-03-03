#The NodeJs Blog
The simple example of creating a blog with NodeJs.

###Dependencies
- express
- body-parser
- errorhandler
- jade
- moment
- mongodb

###Installation & Setup
1. Install [Node.js](https://nodejs.org/) & [MongoDB](https://www.mongodb.org/) if you haven't already.
2. Clone this repository and install its dependencies.

		> git clone git://github.com/paulocsb/node-blog.git node-blog
		> cd node-blog
		> npm i

3. In a separate shell start the MongoDB daemon.

		> mongod

4. From within the node-blog directory, start the server.

		> npm start

5. Open a browser window and navigate to: [http://localhost:1337](http://localhost:1337)