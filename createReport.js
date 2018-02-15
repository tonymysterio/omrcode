//get reportType report number

//on case of error return {"error":"what happened"}

//dont rely on the web service here

//string of requests

//read settings from disk .settingsFiles/settings.json

//read filter from disk .settingsFiles/filter_daily

//connect to bigQuery

const _errorLogger = require('../classes/errorLogger');
var _erlog = new _errorLogger();

const _reportBuilder = require('../classes/reportBuilder.js');
const rb = new _reportBuilder();



//mangle data with appropriate report filter (separate class)

//ok we got a success, save it as .json to data/latestQueries (daily, realtime)

//save the file converted to .csv in reportCSV/[daily].csv

//run the appropriate mailer
var repType = "daily";
var repSubType = 1;

var args = process.argv.slice(2);
//node processRaport daily/realtime 1-3 (levels)
if (args[0]=="realtime") {
    repType='realtime';
}

if (args[1]=="2") {
    repSubType=2;
}
if (args[1]=="3") {
    repSubType=3;
}

//console.log(repType+' '+repSubType);

var fs = require('fs');
const filePath = "./data/latestQueries/"+repType+".json";

fs.readFile(filePath, 'utf8', function (err, filedata) {
    
    if (err) {
        _erlog.queryDataLoadError(filePath,err);

        console.log(JSON.stringify({error:'queryDataLoadError',text:err}))
        process.exit();
        throw err;
    }

    let data = JSON.parse(filedata);

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
        repSubType =1 ;
        break;
    }

    //save to data/latestData  repType_number.json
    var sfilename ="./data/latestReports/"+repType+"_"+repSubType+".json";
    
    fs.writeFile(sfilename, JSON.stringify(d), (err) => {
        if (err) {
            
            _erlog.reportDataSaveError(sfilename,err)
            console.log(JSON.stringify({error:'reportDataSaveError',text:err}))
            process.exit();
            
        };
        
        const ee = JSON.stringify(d);
        //return the jsonobject in case save fails
        console.log(ee);

    });


  });
