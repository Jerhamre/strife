var password;

fs = require('fs')
fs.readFile('./password', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
  password = String(data);

  connectToDB();
});

function connectToDB() {
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'strife',
	  password : password
	});

	connection.connect(function(err) {
	  if (err) {
	    console.error('error connecting: ' + err.stack);
	    return;
	  }

	  console.log('connected as id ' + connection.threadId);
	});
	/*var mysql      = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'strife',
	  password : password,
	  database : 'strife_db'
	});

	connection.connect();

	connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
	  if (err) throw err;

	  console.log('The solution is: ', rows[0].solution);
	});

	connection.end();*/
}

