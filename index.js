const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.locals.pretty = true;
app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

require('./server/routes')(app);

const server = app.listen(process.env.PORT || 1337, () => {
  const { port } = server.address();
  console.log('App now running on port %d in %s mode', port, app.settings.env);
});
