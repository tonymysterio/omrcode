


//var bqData = JSON.parse(fs.readFileSync('data/bigQueryExport.json', 'utf8'));

//var bqData = require('data/bigQueryExport.json');


var filterFields = require('./filterBase.js');
let filFields = new filterFields();

var _grouper = require('./ui/uiJS/grouper.js');
var grouper = new _grouper();

console.log(filFields);

// Read the file and send to the callback
var fs = require('fs');
var readline = require('readline');
let filename = './data/bg3_301.json';
var read_stream = fs.createReadStream(filename);
var rl = readline.createInterface({
    input: read_stream
});

var buffer = [];
var lines =0;

rl.on('line', function(line){
    
    let jline = JSON.parse(line);
    buffer.push(jline)
    //filFields.analyzeKeys(JSON.parse(line));
    console.log(lines++);
    if (lines >1271) {

        let groupByInstanceID = grouper.groupBy_user_dim_app_info_app_instance_id(buffer);
        let pgs = grouper.processGroups(groupByInstanceID);
        console.log("sidralud");
        let fnaa = grouper.EventsErrorsEtcAcrossPopulatedGroups(pgs[1]);
        console.log(fnaa);

        let t =1;
        //console.log(pgs[0]);
        //let mdata = {list : pgs[0],skig:1};

        console.log("ZILCH");
        filFields.reportIgnored();
        process.exit();
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














