var express = require('express');
var cookieParser = require('cookie-parser');;
var app = express();
var app = require('express')()
var basicAuth = require('express-basic-auth')


var mockAdaptor = require ("./mockJsonQuery.js");
var bodyParser = require('body-parser');
var filteredQuery = require("./filteredQuery.js");


var _systemStatus = require("./classes/systemStatus.js");
var ss = new _systemStatus();


const { exec } = require('child_process');

//pastDailyMockAdaptor pulls saved last daily and provides all data inside it
//used for debugging
var _pastDailyMockAdaptor = require("./classes/pastDailyMock.js");
let pdma = new _pastDailyMockAdaptor();
pdma.prime();

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })






const fs = require('fs');
let rawdata = fs.readFileSync('mockData.json');  
let mockData = JSON.parse(rawdata);  

var _mda = new mockAdaptor(mockData);
var _fqa = new filteredQuery();


//just check and bail out it things are not good
var checkAuthCookie = function(cookie,res) {

    if (cookie===undefined) {

        res.status(404)        // HTTP status 404: NotFound
        .send('Not found');
        return;
    }

    if (cookie !== 'authorized') {

        res.status(404)        // HTTP status 404: NotFound
        .send('Not found');
        return;

    }
    console.log('checkAuthCookie OK');
    return true;

}


app.use(cookieParser());

app.get('/login', function (req, res) {
    
    var cookie = req.cookies.omrAuthCookie;
    if (cookie === undefined)
    {
        // no: set a new cookie
        res.cookie('omrAuthCookie','unauthorized', { maxAge: 9000000, httpOnly: true });
        console.log('cookie created successfully');
    } 
    else
    {
        // yes, cookie was already present 
        if (cookie == 'authorized') {
            //fast forward to serviceStatus.html
            fs.readFile('ui/serviceStatus.html', 'utf8', function(err, contents) {
        
                //res.setHeader('Content-Type', 'text/html');
                res.end(contents);
                return;
            });

            return;
        }
        console.log('cookie exists', cookie);
    } 
    //next(); // <-- important!


    fs.readFile('ui/login.html', 'utf8', function(err, contents) {
        
        res.setHeader('Content-Type', 'text/html');
        res.end(contents);

    });


});

app.get('/login_res', urlencodedParser, function (req, res) {

    console.log(req.query);
    let pw = req.query.pw;
    let user = req.query.user;
    if (user!=='admin@admin' && pw !=='admin') {

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({error:'forbidden'}));
        return;
    }
    
    //set basic auth cookie
    res.cookie('omrAuthCookie','authorized', { maxAge: 900000, httpOnly: true });
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({success:'logged_in'}));

});


app.get('/filter', function (req, res) {

    var cookie = req.cookies.omrAuthCookie;
    let tes = checkAuthCookie(cookie,res);

    fs.readFile('ui/filter.html', 'utf8', function(err, contents) {
        
        res.setHeader('Content-Type', 'text/html');
        res.end(contents);
        return;
    });

});

app.get('/settings', function (req, res) {

    var cookie = req.cookies.omrAuthCookie;
    let tes = checkAuthCookie(cookie,res);

    fs.readFile('ui/settings.html', 'utf8', function(err, contents) {
        
        res.setHeader('Content-Type', 'text/html');
        res.end(contents);
        return;
    });

});

app.get('/serviceStatus', function (req, res) {

    var cookie = req.cookies.omrAuthCookie;
    if (tes = checkAuthCookie(cookie,res)) {
        
        fs.readFile('ui/serviceStatus.html', 'utf8', function(err, contents) {
        
            res.setHeader('Content-Type', 'text/html');
            res.end(contents);
            return;
        });

    }

    

});

app.get('/totalErrors', function (req, res) {

    var cookie = req.cookies.omrAuthCookie;
    if (tes = checkAuthCookie(cookie,res)) {
        
        fs.readFile('ui/totalErrors.html', 'utf8', function(err, contents) {
        
            res.setHeader('Content-Type', 'text/html');
            res.end(contents);
            return;
        });

    }

});

app.get('/deviceErrors', function (req, res) {

    var cookie = req.cookies.omrAuthCookie;
    if (tes = checkAuthCookie(cookie,res)) {
        
        fs.readFile('ui/deviceErrors.html', 'utf8', function(err, contents) {
        
            res.setHeader('Content-Type', 'text/html');
            res.end(contents);
            return;
        });

    }

});

app.get('/deviceAllExceptNotifications', function (req, res) {

    var cookie = req.cookies.omrAuthCookie;
    if (tes = checkAuthCookie(cookie,res)) {
        
        fs.readFile('ui/deviceAllExceptNotifications.html', 'utf8', function(err, contents) {
        
            res.setHeader('Content-Type', 'text/html');
            res.end(contents);
            return;
        });

    }

});

app.get('/daily', function (req, res) {

    var cookie = req.cookies.omrAuthCookie;
    if (tes = checkAuthCookie(cookie,res)) {
        
        fs.readFile('ui/daily.html', 'utf8', function(err, contents) {
        
            res.setHeader('Content-Type', 'text/html');
            res.end(contents);
            return;
        });

    }

});

app.get('/logout', function (req, res) {

    res.clearCookie('omrAuthCookie');
    
    fs.readFile('ui/logout.html', 'utf8', function(err, contents) {
        
        res.setHeader('Content-Type', 'text/html');
        res.end(contents);
    });

});






app.use(express.static('ui'));

/*app.use(basicAuth({
    users: { 'admin': 'supersecret' }
}))*/

app.get('/getFilter', function (req, res) {
    console.log(req.query);
    var type='daily';
    if (req.query.type !== 'daily') {
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
    if (qsa.type !== 'daily') {
        type = 'realtime';
    }

    fs.writeFile('settingsFiles/'+type+'_filter.json', JSON.stringify(qsa), function () {
        console.log('wriddun filter of type '+type);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({success:'saved_'+type+'_filter'}));

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


app.get('/getSettings', function (req, res) {
    console.log(req.query);
    

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
        
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({success:'saved_settings'}));

    });

}); //end save

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

    let ss = new _systemStatus();
    ss.allItems(function(list){

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(list));


    })

    //_pastDailyMockAdaptor();
    //let data = pdma.pullEverything();
    //res.setHeader('Content-Type', 'application/json');
    //res.send(JSON.stringify(data));

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



    app.get('/manualDailyReport', function (req, res) {

        exec('node bgProcess.js daily', (err, stdout, stderr) => {

            if (err) {
              console.error(`exec error: ${err}`);
              //_erlog.subProcessExecError('manualDailyReport');
        
              res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error : err }));
              return;
        
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok : true , details : stdout }));

        })

        
    })

    app.get('/manualRealtimeReport', function (req, res) {

        exec('node bgProcess.js realtime', (err, stdout, stderr) => {

            if (err) {
              console.error(`exec error: ${err}`);
              //_erlog.subProcessExecError('manualRealtimeReport');
        
              res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error : err }));
              return;
        
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok : true , details : stdout }));

        })

        
    })



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