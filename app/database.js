var password;

fs = require('fs')
fs.readFile('./password', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
  password = String(data);

  connect();
});

var mysql = require('mysql');
var connection;

function connect() {

	connection = mysql.createConnection({
		host     : 'example.org',
		user     : 'bob',
		password : 'secret'
	});

	connection.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}

		console.log('connected as id ' + connection.threadId);
	});
}

