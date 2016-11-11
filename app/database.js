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

var mysql      = require('mysql');

function connectToDB() {

	/*var connection = mysql.createConnection({
	  host     : '127.0.0.1',
	  port     : '3306',
	  user     : 'root',
	  password : 'p9TDAcJG'
	});*/

	var connection = mysql.createConnection({
	  host     : 'localhost',
	  port     : '3306',
	  user     : 'strife',
	  password : password,
	  database : 'strife_db'
	});

	connection.connect();

	connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
	  if (err) throw err;

	  console.log('The solution is: ', rows[0].solution);
	});

	connection.end();
}

