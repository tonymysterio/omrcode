


//var bqData = JSON.parse(fs.readFileSync('data/bigQueryExport.json', 'utf8'));

//var bqData = require('data/bigQueryExport.json');


var filterFields = require('./filterBase.js');
let filFields = new filterFields();
console.log(filFields);

// Read the file and send to the callback
var fs = require('fs');
var readline = require('readline');
let filename = './data/bigQueryExport.json';
var read_stream = fs.createReadStream(filename);
var rl = readline.createInterface({
    input: read_stream
});

var buffer = [];
var lines =0;

var ev_names = {};
var allData = [];
var lineCount = 0;

var writingFile = false;
rl.on('line', function(line){
    
    if (writingFile) {
        return;
    }

    const obLine = JSON.parse(line);
    //filFields.analyzeKeys(JSON.parse(line));
    var newKey = false;
    if (ev_names[obLine.event_dim_name]==undefined){
        ev_names[obLine.event_dim_name] ={};
        newKey = true;
    }
    if (ev_names[obLine.event_dim_name][obLine.event_dim_params_key]==undefined){
        ev_names[obLine.event_dim_name][obLine.event_dim_params_key] = {};
        newKey = true;
    }
    if (ev_names[obLine.event_dim_name][obLine.event_dim_params_key][obLine.event_dim_params_value_string_value]==undefined){
        ev_names[obLine.event_dim_name][obLine.event_dim_params_key][obLine.event_dim_params_value_string_value] = [];
        newKey = true;
    }
    
    

    if (newKey) {
        ev_names[obLine.event_dim_name][obLine.event_dim_params_key][obLine.event_dim_params_value_string_value].push(lineCount);
        allData.push(obLine);
        lineCount++;
    }



    console.log(lines++);



    if (lines >3271) {
        console.log("ZILCH");
        console.log(ev_names.length);
        console.log(allData.length);
        let o = {evNames : ev_names , data : allData};
        const tt = JSON.stringify(o);
        //console.log(tt);
        //filFields.reportIgnored();
        writingFile = true;
        fs.writeFile('mockData.json', JSON.stringify(o), function () {
            console.log('wriddun');
            process.exit();
        });

        //
    }
})
.on('end', function(){
    //or do it here if there is only one graph
    //displayGraph(buffer);
    
    rl.close();
    
    filFields.reportIgnored();
})

return;
process.exit();



var fs = require('fs');
console.log(fs.readFile('data/bigQueryExport.json', handleFile));














