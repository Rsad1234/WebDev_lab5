var express = require('express');
var app = express();
var DAO = require('./model/nedb');
var dbFile = 'database.nedb.db';
var mustache = require('mustache-express'), path = require('path');


app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', path.resolve(__dirname, 'mustache'));
app.set('port', process.env.PORT || 3000);
let dao = new DAO(dbFile);
app.use(express.urlencoded());
app.use(express.json());

//Landing Page
app.get("/", function (request, response) 
{
    response.status(200);
    response.type('text/html');
    response.send("<h1>Landing</h1>")
});

//Entry Page
app.get("/new-entry", function(request, response) 
{
    response.render("form");
});

app.post("/new-entry", function(request, response) 
{
    console.log(request.body);
    if (!request.body.title || !request.body.content) 
    {
        response.status(400).send("Entries must have a title and content.");
        return;
    }
    dao.insert(undefined ,request.body.title, request.body.content, Date.now()); 
    response.redirect("/data");
});

//Data Page
app.get("/data", function(request, response) 
{
    response.status(200);
    response.type('text/html');
    dao.all().then
    (
        (list) => 
        {
            response.render("entries",
            {
                "PageTitle": "Landing Page",
                "entries": list
            }
            );
        }
    )
        .catch
    (
        (list) =>
        {
            console.log('Error: ')
            console.log(JSON.stringify(err))    
        }
    );
});



//404 Page
app.use(function(request, response)
{
    response.type('text/plain');
    response.status(404);
    response.send('Bad Luck, 404');
});

app.listen(app.get('port'), function() 
{
    console.log('Server Running, ctrl+c to stop');
});