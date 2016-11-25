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

function query(callback, sql, data) {

	console.log("connected to DB, doing query now")

	connection.query(sql, data, function(err, rows, fields) {
		console.log("query done, handle result")
		if (err) {
			console.log('Database query returned error: ', rows);
			if (typeof callback === "function")
				return callback(err, null);
        }

        json = JSON.stringify(rows);
        console.log('JSON-result:', json);

		if (typeof callback === "function")
			callback(null, json);
	});
}

module.exports.query = query