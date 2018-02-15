



_systemStatus = function(){

    //get last daily
    //last realtime
    //last errorlog update

}
var fs = require('fs');

_systemStatus.prototype.latestDaily = function (successHandler,errorHandler) {
    
    let path = './data/latestQueries/daily.json';
    try{ 
        var stats = fs.statSync(path);
        //console.log(stats);
        successHandler(stats.birthtime);
    } catch (err){

        errorHandler(err);
    }

   
}

_systemStatus.prototype.latestRealtime = function (successHandler,errorHandler) {
    
    
    let path = './data/latestQueries/realtime.json';
    try{ 
        var stats = fs.statSync(path);
        //console.log(stats);
        successHandler(stats.birthtime);
    } catch (err){

        errorHandler(err);
    }

   
}

_systemStatus.prototype.latestErrorLog = function (successHandler,errorHandler) {
    
    
    let path = './errorLog/errorLog.json';
    try{ 
        var stats = fs.statSync(path);
        //console.log(stats);
        successHandler(stats.birthtime);
    } catch (err){

        errorHandler(err);
    }

   
}

_systemStatus.prototype.allItems = function(successHandler) {

    this.results = [];
    let ss = this;

    ss.latestDaily(function(birthtime){

        //console.log('latestdaily '+birthtime);
        ss.results.push(['daily',birthtime])
        ss.allItemsCallback(successHandler);

    },function(err){
        //unknown or does not exist
        ss.results.push(['daily','missing'])
        ss.allItemsCallback(successHandler);

    });

    ss.latestRealtime(function(birthtime){

        //console.log('latestrealtime '+birthtime);
        ss.results.push(['realtime',birthtime])
        ss.allItemsCallback(successHandler);

    },function(err){
        //unknown or does not exist
        ss.results.push(['realtime','missing'])
        ss.allItemsCallback(successHandler);

    });
    
    ss.latestErrorLog(function(birthtime){
    
        //console.log('latest errorLog '+birthtime);
        ss.results.push(['errorlog',birthtime])
        ss.allItemsCallback(successHandler);

    },function(err){
        //unknown or does not exist
        ss.results.push(['errorlog','missing'])
        ss.allItemsCallback(successHandler);

    });


}

_systemStatus.prototype.allItemsCallback = function(successHandler){

    if (this.results.length!=3) { return; }
    successHandler(this.results);


}


module.exports = _systemStatus

/*


let ss = new _systemStatus();
ss.allItems(function(list){

    console.log(list);


})

process.exit();

ss.latestDaily(function(birthtime){

    console.log('latestdaily '+birthtime);
},function(err){
    //unknown or does not exist

});

ss.latestRealtime(function(birthtime){

    console.log('latestrealtime '+birthtime);
},function(err){
    //unknown or does not exist

});

ss.latestErrorLog(function(birthtime){

    console.log('latest errorLog '+birthtime);
},function(err){
    //unknown or does not exist
    console.log('latest errorLog '+birthtime);

});


process.exit();

module.exports = _systemStatus

*/
