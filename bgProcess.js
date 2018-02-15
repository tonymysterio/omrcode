
var reportType ='daily';

var args = process.argv.slice(2);
//node processRaport daily/realtime 1-3 (levels)
if (args[0]=="realtime") {
    reportType = "realtime"
}

const { exec } = require('child_process');




const _errorLogger = require('./classes/errorLogger');
var _erlog = new _errorLogger();

var createdReports = [];
var createdReportsErrors = [];

//parseFilter(reportType,function(sql){
    //filter was read and parsed to sql
    pullFromBigQuery(reportType,function(data){

        //fantastic, we got some big query data
        //saveBigQueryDataToDisk(data,reportType,function(){
        console.log('pullFromBigQuery success ');
        console.log(data);
            //data is saved! our first subprocess can read it off the disk and refresh the reports and save them too disk as json
            //loop the three different reports and attach a callback. when all 3 are in, continue
            for (f=1 ;f<4; f++){
                //console.log("flim");
                createReport(f,reportType,function(filename){

                    createdReports.push(filename);
                    //report json is thrown to
                    //data/latestQueries

                    createReportCallback(reportType,filename);
                    //exit pyramid of doom here and continue from createReportCallback
                },function(error){

                    createdReportsErrors.push(error);
                    createReportCallback(reportType,'');

                })
            }

        //},function(error){
            //for some reason save to disk didnt work out
            //the subprocess cannot read it and parse it and cannot turn into csvs, trouble

        //})


    },function(error){
        //pullFromBigQuery went wrong
        console.log('pullFromBigQuery success error with '+error);
        console.log(error);
    })

/*},function(error){

    //parseFilter went wrong. reset filter if thats the problem.

    //when to try again
    _erlog.bgProcessError('what happened');

})*/


//this tracks reports created 
//in data/latestQueries

var createReportsProcessed = [];
var createReportsStarted = false;

function createReportCallback(reportType,filename){

    let tot = createdReports.length + createdReportsErrors.length;
    //console.log('DILL '+tot);
    if (tot<3) { return; }

    reportCallbackFinalize(reportType);

}

var reportCallbackFinalized = false;
function reportCallbackFinalize(reportType){

    console.log('reportCallbackFinalize');
    //called on timer or when the last report is done.
    if (reportCallbackFinalized){
        return; //dont do this twice if we come thru a timer
    }
    reportCallbackFinalized = true;

    //all report data jsons are safely in data/latestQueries
    //now call the convert to CSV script
    //bulk create all csvs and inform when its done or wheter there was an error

    createReportCSVs(reportType,function(reportType,data){

        //the files are now at /reportSCV
        //tell the mailer to send them onwards
        //time to get mailer a-swinging!
        //console.log(data);
        //"reports":[],"errorList"
        if (data.reports.length == 3){

            //everything a ok
            console.log('all reporst created ok')
            console.log(data.reports);

            emailReportsToRecipinets(reportType,data.reports,function(success){


                //might get an error
                if (success.error!==undefined){

                    console.log(success.error);
                    process.exit();

                }
                if (success.users!==undefined){

                    console.log(reportType+'emails succesfully sent to ');
                    while(a=success.users.pop()){
                        console.log(a+' ');
                    }
                    process.exit();
                }

                console.log(success);
                
                },function(error){

                    console.log('error emailReportsToRecipinets exec');

            })

//process.exit();
        }   


        },function(error){

        console.log('createReportCSVs:: errors encountered');

    })


}

function createReportCSVs(reportType,successHandler,errorHandler){

    console.log('createReportCSVs '+reportType);

    //convert and save all three reports to /reportCSV
    exec('node bgSteps/createReportCSVs.js '+reportType, (err, stdout, stderr) => {

        if (err) {
          console.error(`exec error: ${err}`);
          _erlog.subProcessExecError('createReportCSVs');
          errorHandler(err)
          return;

        }
        //create reports gives its own errors to log
        //{"reports":["../data/csv/daily_1_reportaze.csv","../data/csv/daily_3_reportaze.csv","../data/csv/daily_2_reportaze.csv"],"errorList":[]}
        //console.log(stdout);
        //"reports":[],"errorList"

        successHandler(reportType,JSON.parse(stdout));

    });

}


function createReport(repoNo,reportType,successHandler,errorHandler){

    console.log("createReport "+repoNo+' '+reportType);

    exec('node bgSteps/createReport.js '+reportType+' '+repoNo, (err, stdout, stderr) => {

        if (err) {
          console.error(`exec error: ${err}`);
          _erlog.subProcessExecError('createReport');
          errorHandler(err)
          return;

        }
        //console.log(stdout);
        //biqQueryError 
        //biqQueryEmptyResultError 
        //saved by pullFromBigQuery to error log
        successHandler(JSON.parse(stdout));

    });

}

function pullFromBigQuery(reportType,successHandler,errorHandler){

    //pullFromBigQuery

    exec('node bgSteps/pullFromBigQuery.js '+reportType, (err, stdout, stderr) => {

        if (err) {
          console.error(`exec error: ${err}`);
          _erlog.subProcessExecError('pullFromBigQuery');

          errorHandler(err)
          return;

        }
        
        //biqQueryError 
        //biqQueryEmptyResultError 
        //saved by pullFromBigQuery to error log
        successHandler(JSON.parse(stdout));

    });

}

function emailReportsToRecipinets(reportType,reports,successHandler,errorHandler){

    console.log('.. emailReportsToRecipinets '+reportType);
    
    exec('node bgSteps/emailReportsToRecipinets.js '+reportType, (err, stdout, stderr) => {

        
        if (err) {

         console.log('wzz');
          console.error(`exec error: ${err}`);
          _erlog.subProcessExecError('emailReportsToRecipinets');

          errorHandler(err)
          return;

        }
        
        successHandler(JSON.parse(stdout));

    });


}