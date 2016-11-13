// http://stackoverflow.com/questions/21955697/variables-between-node-js-server-and-client

//Lets require/import the HTTP module
var http = require('http');
var ejs = require('ejs');
var fs = require("fs");

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var dispatcher = require('httpdispatcher');
dispatcher.setStatic('resources');

dispatcher.onGet("/", function(req, res) {

    checkLogin();

    res.writeHead(200, {'Content-Type': 'text/html'});

    //since we are in a request handler function
    //we're using readFile instead of readFileSync
    fs.readFile('./www/index.html', 'utf-8', function(err, content) {
        if (err) {
            res.end('error occurred');
            return;
        }
        var temp = 'some temp';  //here you assign temp variable with needed value

        var renderedHtml = ejs.render(content, {temp: temp});  //get redered HTML code
        res.end(renderedHtml);
    });
});  
  
dispatcher.onGet("/about", function(req, res) {
    fs.readFile("./www/about.html", function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

//We need a function which handles requests and send response
function handleRequest(request, response){
    try {
        console.log(request.url);
        //Disptach
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

function checkLogin() {
    if (!req.session.user_id) {
        res.send('You are not authorized to view this page');
    } else {
        res.send('You are logged in');
        //next();asd
    }
}

//Create a server
const PORT=8080; 
var server = http.createServer(handleRequest);
server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});