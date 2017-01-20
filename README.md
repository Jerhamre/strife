# Strife
## A Chat Application
Strife is a website which allows a user to communicate with other users in real time using a dynamically updated text chat. The website allows a user to create chatrooms which other users can join and talk in aswell as allow users to add other users as friends and chat with them in private chat rooms. The website is hosted using node.js and is built in object-oriented JavaScript. For storage, a MySQL relational database is used to storage user information. The front end is written in JavaScript together with HTML5 and CSS. Communication between the client and the server is done using a custom API with help of JSON objects. 
## Dependencies
The following npm packets needs to be installed to run Strife:
* mysql
* express
* express-session
* body-parser
* socket.io
* socket.io-express-session
* session-file-store
* multer

## Installation
Git clone Strife any folder on your system 
```Bash
git clone https://github.com/strifechat/strife.git
cd strife
```
Install Node.js and npm by following this [guide](https://howtonode.org/how-to-install-nodejs) or the instruction on [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/). There is a install script located in the strife folder called [install_dependencies.sh](https://github.com/strifechat/strife/blob/master/install_dependencies.sh) or you could simply run the following commands in terminal.
```Bash
npm install mysql
npm install express
npm install express-session
npm install body-parser
npm install socket.io
npm install socket.io-express-session
npm install session-file-store
npm install multer
npm install ejs
```

Install MySQL database ([mysql_getting_started](http://dev.mysql.com/doc/mysql-getting-started/en/#mysql-getting-started-installing)). A list of MySQL queries needed to set up the database can be found on github in the textfile [dbscript](https://github.com/strifechat/strife/blob/master/dbscript). There is also a .mwb file of the database layout found in the strife folder under [db.mwb](https://github.com/strifechat/strife/blob/master/db.mwb) if you want to setup the database using MySQLWorkbench and forward engineer to the database. Create a file *strife/password* and save the database password. Strifes connection to the database can be changed in *strife/app/database.js* on lines 20-22 if you want to change host adress, port or user.

Update line 27 in *strife/www/resources/js/index.js* to the adress of your server that you are planning to host your server on and set *secure: true* if you are planning on using SSL, otherwise *secure: false*. 
```JavaScript
var socket = io.connect('localhost', {secure: true})
```

Update line 27 in *strife/www/resources/js/index.js* so that the adress point to where your server is located.

### Running strife with SSL
If you want to browse the site via a secure connection you have to get certificate files. A free and easy alternative is [Let’s Encrypt](https://letsencrypt.org/getting-started/). You also have to modify lines 17-21 in *strife/app/HTTPServer.js* so they point to your SSL certificate files.
```JavaScript
var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/cloud-59.skelabb.ltu.se/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/cloud-59.skelabb.ltu.se/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/cloud-59.skelabb.ltu.se/chain.pem')
};
```
### Running strife without SSL
Or if you chose not to secure the site with SSL. Then you have to remove or comment the following lines in *strife/app/HTTPServer.js* 17-21, 59-60 and 111-116. 

```JavaScript
//var options = {
//    key: fs.readFileSync('/etc/letsencrypt/live/cloud-59.skelabb.ltu.se/privkey.pem'),
//    cert: fs.readFileSync('/etc/letsencrypt/live/cloud-59.skelabb.ltu.se/cert.pem'),
//    ca: fs.readFileSync('/etc/letsencrypt/live/cloud-59.skelabb.ltu.se/chain.pem')
//};
```

```JavaScript
    //var serverHTTPS = https.createServer(options, app)
    //serverHTTPS.listen(portSSL) // start listening on secure server
```

```JavaScript
//app.use(function requireHTTPS(req, res, next) {
//  if (!req.secure) {
//    return res.redirect('https://' + req.headers.host + req.url);
//  }
//  next();
//})
```
You will also need to modify line 62 from

```JavaScript
  io = require('socket.io')(serverHTTPS);
``` 
to 
```JavaScript
  io = require('socket.io')(server);
``` 


