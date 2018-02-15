

function pastDailyMockAdaptor() {
    this.data = [];
    this.primed = false;

}

var fs = require('fs');

pastDailyMockAdaptor.prototype.prime = function(filter,successHandler,errorHandler){

    // Read the file and send to the callback
    
    var readline = require('readline');
    let filename = './data/bg3_301.json';
    var read_stream = fs.createReadStream(filename);
    var rl = readline.createInterface({
        input: read_stream
    });

    var buffer = [];
    var lines =0;
    var me = this; 

    rl.on('line', function(line){
    
        let jline = JSON.parse(line);
        me.data.push(jline)
        //filFields.analyzeKeys(JSON.parse(line));
        //console.log(lines++);
        lines++;
        if (lines >7281) {
            if (successHandler!==undefined){
                successHandler(me.data);
                //console.log('SUCC')
                return;
            }
            
            me.saveDailyRealtimeMocks();
        }

    })
    .on('end', function(){
        //or do it here if there is only one graph
        //displayGraph(buffer);
        console.log("finished pulling mock data "+me.data.length)
        me.saveDailyRealtimeMocks();
        rl.close();
        
    })

}   //end prime

pastDailyMockAdaptor.prototype.saveDailyRealtimeMocks = function(){

    let data = JSON.stringify(this.data);


    fs.writeFile('../data/latestQueries/daily.json', data , function () {
        console.log('written daily mock data ');

    });

    fs.writeFile('../data/latestQueries/realtime.json', data , function () {
        console.log('wriddun realtime of type ');
        
    });




}
pastDailyMockAdaptor.prototype.pullEverything = function(){

    return this.data;

}


module.exports = pastDailyMockAdaptor;
/*

var fs = require('fs');

let pdm = new pastDailyMockAdaptor();
console.log("pastDailyMockAdaptor");
pdm.prime();

*/






