var express = require('express');
var app = express();
var mockAdaptor = require ("./mockJsonQuery.js");
var bodyParser = require('body-parser');
var filteredQuery = require("./filteredQuery.js");

//pastDailyMockAdaptor pulls saved last daily and provides all data inside it
//used for debugging
var _pastDailyMockAdaptor = require("./pastDailyMock.js");
let pdma = new _pastDailyMockAdaptor();
pdma.prime();

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('ui'));

const fs = require('fs');
let rawdata = fs.readFileSync('mockData.json');  
let mockData = JSON.parse(rawdata);  

var _mda = new mockAdaptor(mockData);
var _fqa = new filteredQuery();

app.get('/getFilter', function (req, res) {
    console.log(req);
    var type='daily';
    if (req.query.type !== daily) {
        type = 'realtime';
    }

    fs.readFile('settingsFiles/'+type+'_filter.json', 'utf8', function(err, contents) {
        
        res.setHeader('Content-Type', 'application/json');
        res.end(contents);

    });


});

app.post('/saveFilter', urlencodedParser, function (req, res) {

    const qs = req.body;
    const fi = Object.keys(qs);
    const qsa = JSON.parse(fi[0]);
    console.log(qsa);
    var type='daily';
    if (req.query.type !== daily) {
        type = 'realtime';
    }

    fs.writeFile('settingsFiles/'+type+'_filter.json', JSON.stringify(qsa), function () {
        console.log('wriddun filter of type '+type);
        //process.exit();
    });

}); //end save

app.post('/testFilter', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
       first_name:req.body.first_name,
       last_name:req.body.last_name
    };
    
    const qs = req.body;
    const fi = Object.keys(qs);
    const qsa = JSON.parse(fi[0]);
    console.log(qsa);
    const rep = _mda.queryMockDataWithQueryArray(qsa);

    console.log("reply from mockdata length" + rep.length);
    //console.log(rep);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(rep));
 })

app.get('/pastDaily', function (req, res) {
     
    //get past daily to the server for level1,2,3 reports
    //data/latestQueries
    let data = pdma.pullEverything();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));

});


app.get('/pastRealtime', function (req, res) {
     
    //get past realtime to the server for level1,2,3 reports
    //data/latestQueries
    let data = pdma.pullEverything();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));

});


app.get('/systemStats', function (req, res) {
     
    //look at
    //data/latestQueries
    //last update to daily,realtime report
    //last update to error log inside errorLog folder


    let data = pdma.pullEverything();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));

});


app.get('/getSettings', function (req, res) {
    

    fs.readFile('settingsFiles/settings.json', 'utf8', function(err, contents) {
        
        res.setHeader('Content-Type', 'application/json');
        res.end(contents);

    });


});

app.post('/saveSettings', urlencodedParser, function (req, res) {

    const qs = req.body;
    const fi = Object.keys(qs);
    const qsa = JSON.parse(fi[0]);
    console.log(qsa);
    

    fs.writeFile('settingsFiles/settings.json', JSON.stringify(qsa), function () {
        console.log('written settings file');
        //process.exit();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok : true }));

    });

}); //end save



app.get('/filteredQuery', function (req, res) {

    const re = _fqa.queryWithSavedFilter();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(re));
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})