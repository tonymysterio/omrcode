var _processSettings = function(){

    this.mailRecipients = {
     "0" : {email : "zestdaily1@test.com" , "type" : "daily" ,  "timestamp" : 12341324},
     "1" : {email : "testreal1@test.com" , "type" : "realtime","timestamp" : 12341324 },
     "2" : {email : "testAdmin1@test.com" , "type" : "admin" ,"timestamp" : 12341324},
     "3" : {email : "realtime2@test.com" , "type" : "realtime","timestamp" : 12341324 },
     "4" : {email : "daily2@test.com" , "type" : "daily","timestamp" : 12341324 },

    }


}

var _serviceStatus = function(){

    this.statusHistory = {

        "dailyReportLastRun" : { "timestamp" : 12341324},
        "realtimeReportLastRun" : { "timestamp" : 12341524 },
        "errorLogUpdated" : { "timestamp" : 12344324 }
    }



}

var _ps = new _processSettings();
var _ss = new _serviceStatus();


function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }

  function totalErrors(){
    console.log("test");
    //throw filter settings to node, open an iframe with test report data
    //const sw = _fe.getScenarioSwitches();
    //var _fap = new filterAdaptor();

    const sw = _fe.getScenarioSwitches();
    const ou = JSON.stringify(sw);
    localStorage.setItem('fbFilters', ou);

    var request = new XMLHttpRequest();
        request.open('POST', '/saveFilter', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(ou);

    setTimeout(() => window.open('http://localhost:8081/totalErrors.html'), 300);

    return;
    //window.open('http://javascript.info/')


    //JSON.parse(jso))
    if (lookArray = _fap.convertToLookForArray(sw)){
        const sedo = lookArray;
        //console.log(JSON.stringify(lookArray));

        var request = new XMLHttpRequest();
        request.open('POST', '/testFilter', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(JSON.stringify(lookArray));
    }


}


function deviceErrors(){
    
    setTimeout(() => window.open('http://localhost:8081/deviceErrors'), 300);

}

function totalErrors(){
    
    setTimeout(() => window.open('http://localhost:8081/totalErrors'), 300);

}

function deviceExceptErrors(){
    
    setTimeout(() => window.open('http://localhost:8081/deviceAllExceptNotifications'), 300);

}

