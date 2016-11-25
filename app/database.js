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

	//connection.connect();

	// secure sql vs injection

	var rs = null

	var query = connection.query(sql, data, function(err, rows, fields) {
		if (err)
			console.log('Database query returned: ', rows);
            return callback(err, null);

        console.log('The query-result is: ', results[0]);

        // wrap result-set as json
        json = JSON.stringify(results);

        /***************
        * Correction 2: Nest the callback correctly!
        ***************/
        connection.end();
        console.log('JSON-result:', json);
        callback(null, json);
	});

	query.on('error', function(err) {
    	throw err;
	});
 
	query.on('fields', function(fields) {
  	  console.log(fields);
	});
 
	query.on('result', function(row) {
	    console.log(row.post_title);
	});
	//connection.end()
}

module.exports.query = query