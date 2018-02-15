const fs = require('fs');



_errorLogger = function(){

    //quickly commit a textual error text

}

_errorLogger.prototype.addEntry = function (entry) {
    
    //pass an object, save stuff as json
    entry.timestamp = this.timestamp();

    //add to end of file
    fs.appendFile('./errorLog/errorLog.json', JSON.stringify(entry), function (err) {
        if (err) throw err;
        //console.log('Saved!');
      });

      

}


_errorLogger.prototype.commit = function (entry) {
    
    //pass an object, save stuff as json
    entry.timestamp = this.timestamp();

    //add to end of file

}


_errorLogger.prototype.biqQueryError = function(text,error){

    //general big query error, pull didnt work, auth didnt work
    let errorO = {};
    errorO.type = 'bigQuery';
    errorO.subType = 'generic';
    errorO.error = error;
    errorO.text = text;
    this.addEntry(errorO);
    return errorO;
}

_errorLogger.prototype.biqQueryEmptyResultError = function(text){

    //everything was disabled with filter
    let errorO = {};
    errorO.type = 'bigQuery';
    errorO.subType = 'emptyResult';
    errorO.text = text;
    this.addEntry(errorO);
    return errorO;
}

_errorLogger.prototype.filterEverythingDisabledError = function(text){

    //everything was disabled with filter
    let errorO = {};
    errorO.type = 'filter';
    errorO.subType = 'everythingDisabled';
    errorO.text = text;
    this.addEntry(errorO);
    return errorO;
}

_errorLogger.prototype.filterFileReadFailError = function(text){

    //filter file read fail. FALLBACK, create and save a new filter with everything enabled
    //json garbled, file access didnt work out results to this
    let errorO = {};
    errorO.type = 'filter';
    errorO.subType = 'fileReadFail';
    errorO.text = text;
    this.addEntry(errorO);
    return errorO;
}

_errorLogger.prototype.settingsFileReadFailError = function(text){

    //settings file read fail. FALLBACK, create and save a new settings with default recipients
    //json garbled, file access didnt work out results to this
    let errorO = {};
    errorO.type = 'settings';
    errorO.subType = 'fileReadFail';
    errorO.text = text;
    this.addEntry(errorO);
    return errorO;
}

_errorLogger.prototype.queryDataSaveError = function(filename,text){

    //the current daily/realtime files were not replaced
    let errorO = {};
    errorO.type = 'query';
    errorO.filename = filename;
    errorO.subType = 'dataSaveError';
    errorO.text = text;
    this.addEntry(errorO);
    return errorO;
    
}

_errorLogger.prototype.queryDataLoadError = function(filename,text){

    //daily or realtime not successfully pulled from disk or garbled json
    //no report can be sent. new data should appear to /data and problem magically gone
    let errorO = {};
    errorO.type = 'query';
    errorO.filename = filename;
    errorO.subType = 'dataLoadError';
    errorO.text = text;

    this.addEntry(errorO);
    return errorO;
    
}

_errorLogger.prototype.reportDataSaveError = function(filename,text){

    //the current daily/realtime files were not replaced
    let errorO = {};
    errorO.type = 'report';
    errorO.subType = 'dataSaveError';
    errorO.filename = filename;
    errorO.text = text;
    this.addEntry(errorO);
    return errorO;
}

_errorLogger.prototype.reportDataLoadError = function(filename,text){

    //daily or realtime not successfully pulled from disk or garbled json
    //no report can be sent. new data should appear to /data and problem magically gone
    let errorO = {};
    errorO.type = 'report';
    errorO.subType = 'dataLoadError';
    errorO.filename = filename;
    errorO.text = text;
    
    this.addEntry(errorO);
    return errorO;
}


_errorLogger.prototype.csvSaveError = function(filename,text){

    //failed to save the csv for some reason
    //text could be the filename of the csv
    let errorO = {};
    errorO.type = 'csv';
    errorO.filename = filename;
    errorO.subType = 'saveError';
    errorO.text = text;

    this.addEntry(errorO);
    return errorO;
    
}

_errorLogger.prototype.csvLoadError = function(filename,text){

    //mailer might have a hard time attaching the csv's for some reason
    //text could be the filename of the csv
    let errorO = {};
    errorO.type = 'csv';
    errorO.filename = filename;
    errorO.subType = 'loadError';
    errorO.text = text;
    
    this.addEntry(errorO);
    return errorO;
}

_errorLogger.prototype.csvGenerationError = function(text){

    //something went wrong generating the csv file
    //text is daily/realtime / reportType 1,2,3
    let errorO = {};
    errorO.type = 'csv';
    errorO.subType = 'generationError';
    errorO.text = text;
    
    this.addEntry(errorO);
    return errorO;
}

_errorLogger.prototype.subProcessExecError = function(text){

    //something went wrong starting a subprocess to pull data, create csv, mail
    //pass subprocess name and calling function with text
    let errorO = {};
    errorO.type = 'subProcess';
    errorO.subType = 'loadError';
    errorO.text = text;
    this.addEntry(errorO);
    return errorO;vv
}

_errorLogger.prototype.mailServerAccessError = function(text){

    //could not reach mailserver, error details on text
    let errorO = {};
    errorO.type = 'mail';
    errorO.subType = 'mailServerAccessError';
    errorO.text = text;
    this.addEntry(errorO);
    return errorO;
}

_errorLogger.prototype.mailServerEmptyRecipientsError = function(text){

    //settings is borked or empty, no recipients for mail
    //ignores this quietly but logs as an error

    let errorO = {};
    errorO.type = 'mail';
    errorO.subType = 'mailServerEmptyRecipients';
    errorO.text = text;
    this.addEntry(errorO);
    return errorO;
}


_errorLogger.prototype.bgProcessError = function(text){

    //general error, bg process didnt complete and node waits to fire it again in15 mins or so
    let errorO = {};
    errorO.type = 'bgprocess';
    errorO.subType = 'general';
    errorO.text = text;
    this.addEntry(errorO);
    return errorO;
}

_errorLogger.prototype.timestamp = function() {

    return Math.floor((new Date).getTime()/1000); 

}



module.exports = _errorLogger


