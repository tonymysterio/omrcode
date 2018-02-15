var repType = "daily";
var repSubType = 1;

var json2csv = require('json2csv');
fs = require('fs');


var args = process.argv.slice(2);
//node processRaport daily/realtime 1-3 (levels)
if (args[1]=="2") {
    repSubType=2;
}
if (args[1]=="3") {
    repSubType=3;
}

const { exec } = require('child_process');

exec('node processDailyReport '+repType+' '+repSubType, (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }

  //gets json back, turn this into csv

  //console.log(`Number of files ${stdout}`);
  const filePath = 'reportCSV/zit'+repType+'_'+repSubType+'_reportaze.csv';
  try {
    
    const data = JSON.parse(stdout);
    var fields = [];
    //console.log(data[0]);
    Object.keys(data[0]).forEach(function(key) {
        //console.log(key);
        fields.push(key);
    });

    var result = json2csv({ data: data, fields: fields });
    //console.log(result);
    
    fs.writeFile(filePath, result, 'utf8', function (err) {
        if (err) return console.log(err);
     });

    } catch (err) {
        // Errors are thrown for bad options, or if the data is empty and no fields are provided.
        // Be sure to provide fields if it is possible that your data array will be empty.
        console.error(err);
    }


});
