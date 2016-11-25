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

	/*var rs = null

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
    /*    connection.end();
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
	//connection.end()*/



	var callback = function(err, result) {
        /*res.writeHead(200, {
            'Content-Type' : 'x-application/json'
        });*/
        console.log("OUR WANTED RESULT IS BELOW!?");
        console.log('err:', err);
        console.log('json:', result);
        //res.end(result);
        return result;
    };

    doQuery(callback, sql, data);
}

function doQuery(callback, sql, data) {
	
	connection.connect();

	console.log("connected to DB, doing query now")

	connection.query(sql, data, function(err, rows, fields) {
		console.log("query done, handle result")
		if (err)
			console.log('Database query returned error: ', rows);
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
}

module.exports.query = query