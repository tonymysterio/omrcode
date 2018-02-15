

//update 

//var _ps = new _processSettings();
//var _ss = new _serviceStatus();


function updateServiceStatuses() {

    //#serviceStatus
    /*Object.keys(obj).forEach(function(key) {
        console.log(key, obj[key]);
    });*/

    

    /*var myNode = document.getElementById("serviceStatus");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }*/

    Object.keys(_ss.statusHistory).forEach(function(key) {
        console.log(key, _ss.statusHistory[key]);
        var yNode = document.getElementById(key);
        console.log(yNode);
        let tw = timeConverter(_ss.statusHistory[key].timestamp)
        yNode.innerHTML = tw;
    });


}


function updateServiceStatusesArray(ar) {

    ///[["daily","2018-02-14T01:43:45.000Z"],["realtime","2018-02-14T01:59:13.000Z"],["errorlog","missing"]]
    //[["daily","2018-02-14T01:43:45.000Z"],["realtime","2018-02-14T01:59:13.000Z"],["errorlog","missing"]]
    
    while(a=ar.pop()){

        switch(a[0]){

            case "daily":
            var yn = document.getElementById("dailyReportLastRun");
            yn.innerHTML = a[1];

            break;
            case "realtime":
            var yn = document.getElementById("realtimeReportLastRun");
            yn.innerHTML = a[1];

            break;
            default:
            var yn = document.getElementById("errorLogUpdated");
            yn.innerHTML = a[1];
            break;
        }


    }


}


function requestDaily () {

    var request = new XMLHttpRequest();
    request.open('GET', '/manualDailyReport', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        //set auth cookie
        console.log(request.reponse);
        alert('ok!')

      } else {
        // We reached our target server, but it returned an error
            console.log("request error");
            //populateFilters();
        }
     };

    request.onerror = function() {
      // There was a connection error of some sort
      console.log("request onerror");
      //populateFilters();
      
    };

    request.send();

}

function requestRealtime () {

    var request = new XMLHttpRequest();
    request.open('GET', '/manualRealtimeReport', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        //set auth cookie
        console.log(request.reponse);
        alert('ok!')

      } else {
        // We reached our target server, but it returned an error
            console.log("request error");
            //populateFilters();
        }
     };

    request.onerror = function() {
      // There was a connection error of some sort
      console.log("request onerror");
      //populateFilters();
      
    };

    request.send();

}


var request = new XMLHttpRequest();
request.open('GET', '/systemStats', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Success!
    var data = JSON.parse(request.responseText);
    
    //[["daily","2018-02-14T01:43:45.000Z"],["realtime","2018-02-14T01:59:13.000Z"],["errorlog","missing"]]
    updateServiceStatusesArray(data);

  } else {
    // We reached our target server, but it returned an error

  }
};

request.onerror = function() {
  // There was a connection error of some sort
};

request.send();

updateServiceStatuses();

