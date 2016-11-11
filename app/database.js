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
	var Client = require('mysql').Client,
    client = new Client();
    client.user = 'strife'; 
    client.password = password;

    client.connect();
}

