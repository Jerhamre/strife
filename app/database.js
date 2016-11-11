var reader = new FileReader();
reader.onload = function(progressEvent){
  // Entire file
  console.log(this.result);

  // By lines
  var lines = this.result.split('\n');
  for(var line = 0; line < lines.length; line++){
    console.log(lines[line]);
  }
};
reader.readAsText('../password');

/*
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'pass',
  database : 'strife_db'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

connection.end();
*/