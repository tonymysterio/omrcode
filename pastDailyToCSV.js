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

    const data = res.body;
    var fields = [];
    console.log(data[0]);
    Object.keys(data[0]).forEach(function(key) {
        console.log(key);
        fields.push(key);
    });
    //console.log(fields);
    //process.exit();

    try {
        
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