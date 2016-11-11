// http://stackoverflow.com/questions/21955697/variables-between-node-js-server-and-client

//Lets require/import the HTTP module
var http = require('http');
var ejs = require('ejs');
var fs = require("fs");
var dispatcher = require('httpdispatcher');

//For all your static (js/css/images/etc.) set the directory name (relative path).
dispatcher.setStatic('resources');

//A sample GET request    
dispatcher.onGet("/", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    //since we are in a request handler function
    //we're using readFile instead of readFileSync
    fs.readFile('./www/html/index.html', 'utf-8', function(err, content) {
        if (err) {
            res.end('error occurred');
            return;
        }
        var temp = 'some temp';  //here you assign temp variable with needed value

        var renderedHtml = ejs.render(content, {temp: temp});  //get redered HTML code
        res.end(renderedHtml);
    });
});  

//A sample GET request    
dispatcher.onGet("/about", function(req, res) {
    fs.readFile("./www/html/about.html", function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
});  

//A sample GET request    
dispatcher.onGet("/page1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Page One');
});    

//A sample POST request
dispatcher.onPost("/post1", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Got Post Data');
});

//Lets define a port we want to listen to
const PORT=8080; 

//We need a function which handles requests and send response
function handleRequest(request, response){
    try {
        //log the request on console
        console.log(request.url);
        //Disptach
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});