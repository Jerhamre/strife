var password;

fs = require('fs')
fs.readFile('./password', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  password = data.replace(/^\s+|\s+$/g,'');

  connectToDB();
});

var mysql      = require('mysql');

var connection = null;

function connectToDB() {

	connection = mysql.createConnection({
	  host     : '127.0.0.1',
	  port     : '3306',
	  user     : 'strife',
	  password : password,
	  database : 'strife_db'
	});

	/*connection.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}
		console.log('connected as id ' + connection.threadId);
	});*/

	connection.connect();

	connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
	  if (err) throw err;

	  console.log('The solution is: ', rows[0].solution);
	});

	connection.end();

	connection.connect();

	connection.query('SELECT * FROM users WHERE 1;', function(err, rows, fields) {
	  if (err) throw err;

	  console.log('Users: ', rows);
	});

	connection.end();
}

function query(sql, data) {

	connection.connect();

	// secure sql vs injection

	var rows = null

	connection.query(sql, data, function(err, rows, fields) {
	  if (err) throw err;
	});

	connection.end()
	if (rows == null)
		return;
	return rows;
}

module.exports.query = query