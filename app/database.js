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

	connection.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}
		console.log('connected as id ' + connection.threadId);
	});
}

function query(sql, data) {

	connection.connect();

	// secure sql vs injection

	connection.query(sql, data, function(err, rows, fields) {
	  if (err) throw err;

	  console.log('sql query returned: ', rows);
	});

	connection.end();

	return rows;
}

module.exports.query = query