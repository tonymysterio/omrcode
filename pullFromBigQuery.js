//get reportType  daily / realtime

//load filter

//parse

//pull

//save

//return {success:ok} / {error:'text'}

const _errorLogger = require('../classes/errorLogger');
var _erlog = new _errorLogger();

const _parseFilterToSql = require('../classes/filterToSql');
var _parseFilter = new _parseFilterToSql();


const _bigQuery = require('../classes/bigQuery');
var _bgQuery = new _bigQuery();

//console.log(_parseFilter);

//this guy needs the daily/realtime parameter

var repType = "daily";


var args = process.argv.slice(2);
//node processRaport daily/realtime 1-3 (levels)
if (args[0]=="realtime") {
    repType = "realtime"
}

//this does the thing, on error writes to error log
var fs = require('fs');
const filePath = "./settingsFiles/"+repType+"_filter.json";

fs.readFile(filePath, 'utf8', function (err, filedata) {
    
    if (err) {
        _erlog.filterFileReadFailError(filePath,err);

        console.log(JSON.stringify({error:'filterFileReadFailError',text:err}))
        process.exit();
        throw err;
    }

    //let jsonData = '{"dirty":false,"device_registration":{"onOff":false,"dirty":true,"list":{"company_code":true,"branch_code":true,"device_code":true,"status":["info","warn","error","fatal"],"error_info":true,"device_type":true,"device_nickname":true,"serial_no":true,"serial_date":true,"action":false,"value":true}},"device_setting":{"onOff":false,"dirty":false,"list":{"company_code":true,"branch_code":true,"device_code":true,"status":["info","warn","error","fatal"],"error_info":true,"device_type":true,"device_nickname":true,"serial_no":true,"serial_date":true,"action":["device_set","datetime_update","device_delete","device_change_name"],"value":true}},"data_transfering":{"onOff":false,"dirty":false,"list":{"company_code":true,"branch_code":true,"device_code":true,"status":["info","warn","error","fatal"],"error_info":true,"device_type":true,"device_nickname":true,"serial_no":true,"serial_date":true,"action":["data_transfer","data_cloud_sync"],"value":true}},"device_statistics":{"onOff":true,"dirty":false,"list":{"company_code":true,"branch_code":true,"device_code":true,"status":true,"error_info":true,"device_type":true,"device_nickname":true,"serial_no":true,"serial_date":true,"action":["serial_data_overflow_detection","checksum_error_detection","timezone_change_detection","time_difference_detection"],"value":true}},"app_setting":{"onOff":true,"dirty":false,"list":{"company_code":false,"branch_code":false,"device_code":true,"status":["info","warn","error","fatal"],"error_info":false,"app_version":false,"def_file_version":true,"action":["app_update","definition_update"],"value":true}},"type":"daily","timestamp":123}';
    let data2 = JSON.parse(filedata);
    //let a = JSON.parse(jsonData);
    //console.log(data2);
    //process.exit();
    let sqString = _parseFilter.parse(data2);
    let fulS = _parseFilter.fullSql(sqString);

    //console.log(fulS);
    
    _bgQuery.pull(fulS,function(lines){
        //FAKE
        if (lines.length==0){
            _erlog.biqQueryEmptyResultError();
            console.log(JSON.stringify({error:'biqQueryEmptyResultError'}))
            process.exit();
        }
        //console.log(lines.length);
        saveQueryResults(repType,lines,function(filePath){
                //success
                console.log(JSON.stringify({success:'queryDataSaved, length '+lines.length,filePath : filePath}))
                process.exit();

            },function(err,filePath){
                //err with saving
                let er = _erlog.queryDataSaveError(filePath,err);
                console.log(JSON.stringify(er))
                process.exit();
            }

        );

        }, function(err){
            
            let er = _erlog.biqQueryError('generic',err)
            //something went wrong pulling bigQuery data

            console.log(JSON.stringify({error:'bigQueryError',data:er}))
            process.exit();
    })

    //let data = JSON.parse(filedata);
    //console.log(data);

});

//for writing to latestQueries


saveQueryResults = function(repType,data,successHandler,errorHandler){

    let data2 = JSON.stringify(data);

    let filePath = './data/latestQueries/'+repType+'.json';
    fs.writeFile(filePath, data2 , function (err) {
        if (err){
            
            return errorHandler(err,filePath);
        }
        //console.log('written daily mock data ');
        successHandler(filePath);

    });

}


//console.log(JSON.stringify({success:repType}));

//filterEverythingDisabledError
//filterFileReadFailError

//biqQueryError 
//biqQueryEmptyResultError 

//queryDataSaveError
