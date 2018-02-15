const { el, mount ,setChildren, setAttr } = redom;
//update 

//var _ps = new _processSettings();
//var _ss = new _serviceStatus();


/*
var t2 = el('label',{
    //value : "realtime",
    for : parentName,
    innerHTML : parentName,
    type : 'label',
})

rowPre.appendChild(t2);
rowPre.appendChild(t);
rowPre.appendChild(row);
*/




var _ps = new _processSettings();


function rowItem (rowData){

    var l = [];

    var row = el('tr',{
        
    })

    Object.keys(rowData).forEach(function(key) {
        
        let vv = rowData[key];
        let ch = el('td',{
            innerHTML : vv
        })

        row.appendChild(ch);

    })

    return row;

}


function displayTable (data) {

    //data contains filter and list

    var yNode = document.getElementById('reportTable');

    //make table headers

    let thead = el('thead',{
        innerHTML : ''
    })

    let headers = el('tr',{
        innerHTML : ''
    })



    Object.keys(data[0]).forEach(function(key) {

        let ch = el('th',{
            innerHTML : key
        })

        headers.appendChild(ch);
    })

    thead.appendChild(headers);
    yNode.appendChild(thead);

    //Object.keys(data.list).forEach(function(key) {
    let tbody = el('tbody',{
            innerHTML : ''
        })

    while (a=data.pop()){ 

        /*var row = el('label',{
            //value : "realtime",
            for : parentName,
            innerHTML : parentName,
            type : 'label',
        })*/

        var row = rowItem(a);

        tbody.appendChild(row);

        

    }

    yNode.appendChild(tbody);

    //add sorting
    new Tablesort(document.getElementById('reportTable'));

}

var grouper = new _grouper();

var request = new XMLHttpRequest();
//request.open('GET', '/filteredQuery', true);
request.open('GET', '/pastDaily', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Success!
    var data = JSON.parse(request.responseText);
    //
    let groupByInstanceID = grouper.groupBy_user_dim_app_info_app_instance_id(data);
    let pgs = grouper.processGroups(groupByInstanceID); //returns populated groups
    
    //let fnaa = grouper.EventsErrorsEtcAcrossPopulatedGroups(pgs[1]);
    let fi = grouper.filterForDeviceErrors(pgs[1]);
    displayTable( fi );
  } else {
    // We reached our target server, but it returned an error

  }
};

request.onerror = function() {
  // There was a connection error of some sort
};

request.send();
