//dont rely on the web service here

//string of requests

//read settings from disk .settingsFiles/settings.json

//read filter from disk .settingsFiles/filter_daily

//connect to bigQuery


const _reportBuilder = require('./classes/reportBuilder.js');
const rb = new _reportBuilder();



//mangle data with appropriate report filter (separate class)

//ok we got a success, save it as .json to data/latestQueries (daily, realtime)

//save the file converted to .csv in reportCSV/[daily].csv

//run the appropriate mailer
var repType = "daily";
var repSubType = 1;

var args = process.argv.slice(2);
//node processRaport daily/realtime 1-3 (levels)
if (args[1]=="2") {
    repSubType=2;
}
if (args[1]=="3") {
    repSubType=3;
}

//console.log(repType+' '+repSubType);

const superagent = require('superagent');
var json2csv = require('json2csv');
fs = require('fs');
const filePath = "reportCSV/pastDaily.csv";

superagent.get('http://localhost:8081/pastDaily')
//.query({ api_key: 'DEMO_KEY', date: '2017-08-02' })
.end((err, res) => {
  if (err) { return console.log(err); }
  //console.log(res.body);
  //console.log(res.body.url);
  //console.log(res.body.explanation);

    const data = res.body; //its already json
    var d = {};

    switch (repSubType){
        case 2:
        d = rb.level2(data);
        //console.log(d);
        //const ee = JSON.stringify(d);
        //console.log(ee);
        break;
        case 3:
        
        d = rb.level3(data);
        //const ee = JSON.stringify(d);
        //console.log(ee);
        break;
        default:
        d = rb.level1(data);
        //const ee = JSON.stringify(d);
        //console.log(ee);
        break;
    }

    const ee = JSON.stringify(d);
    console.log(ee);

    //console.log(JSON.stringify(d));
    //systemwide error totals
    //totalErrors, level1 from web interface
    //device errors with err/warn totals. level2
    
    //
    //console.log(fields);
    //process.exit();

    
    

});