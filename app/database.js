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

function connectToDB() {

	var connection = mysql.createConnection({
	  host     : '127.0.0.1',
	  port     : '3306',
	  user     : 'strife',
	  password : password,
	  database : 'strife_db'
	});

}

function query(sql, fields) {

	connection.connect();

	connection.query(sql, function(err, rows, fields) {
	  if (err) throw err;

	  console.log('sql query returned: ', rows);
	});

	connection.end();

	return rows;
}

module.exports.query = query