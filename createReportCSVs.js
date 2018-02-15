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

//load and create 3 reports
var reports = [];
var errorList = [];

var fs = require('fs');

for (f=1; f<4; f++ ) {  

    pulz(repType,f);
   
}

function pulz(repType,f){

    const filePath = "./data/latestReports/"+repType+"_"+f+".json";

    fs.readFile(filePath, 'utf8', function (err, filedata) {
    
        if (err) {

            errorList.push(_erlog.reportDataLoadError(filePath,err));
            return csvConvertCallback();
            
        }
        
        convertToCSVandSave(repType,f,JSON.parse(filedata));

    })

}

var dateFormat = require('dateformat');

var json2csv = require('json2csv');

function convertToCSVandSave (rt,rst,data){

    var now = new Date();
    let da = dateFormat(now, "yyyymmddhh" );

    const filePath = './data/csv/'+rt+'_'+da+'_'+rst+'_report.csv';
  
    try {
    
    
        var fields = [];
        //console.log(data[0]);
        Object.keys(data[0]).forEach(function(key) {
            //console.log(key);
            fields.push(key);
        });

        var result = json2csv({ data: data, fields: fields });
        
    
        fs.writeFile(filePath, result, 'utf8', function (err) {
            if (err) {
                errorList.push(_erlog.csvSaveError(filePath,err));
                return csvConvertCallback();
            }
            reports.push(filePath);
            return csvConvertCallback();
        });

        } catch (err) {
        // Errors are thrown for bad options, or if the data is empty and no fields are provided.
        // Be sure to provide fields if it is possible that your data array will be empty.
        var errs = _erlog.csvGenerationError(err);
        errorList.push(errs);
        return csvConvertCallback();
    }


}

function csvConvertCallback (){

    let tot = errorList.length + reports.length;
    if (tot<3) {
        return;
    }

    let o = {
        reports,
        errorList
    }

    console.log(JSON.stringify(o));

}
