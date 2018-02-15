
const { el, mount ,setChildren, setAttr } = redom;
//update 

//var _ps = new _processSettings();
//var _ss = new _serviceStatus();

var _ps = new _processSettings();
var _fe = new filterFields();
_fe.type = 'daily'  //realtime

function populateFilters (){

    var scenarios = _fe.getScenarioTypes();
    var scenariosSelections = _fe.primeScenarioSwitches();
    console.log(scenariosSelections);
    var s = {};
    var me = this;

    Object.keys(scenarios).forEach(function(key) {
        let mk = scenarios[key];
        let m = entry(scenarios[key],scenariosSelections[mk])
    });


}

function populateWithRetrievedFilter (data) {

    var scenarios = _fe.getScenarioTypes();
    var scenariosSelections = _fe.primeScenarioSwitches();

    _fe.injectScenarioSwitches(data);

    document.getElementById('filteringSections').innerHTML = '';

    var scenarios = _fe.getScenarioTypes();
    var scenariosSelections = _fe.switches; //getScenarioSwitches();
    console.log(scenariosSelections);
    var s = {};
    var me = this;

    Object.keys(scenarios).forEach(function(key) {
        let mk = scenarios[key];
        let m = entry(scenarios[key],scenariosSelections[mk])
    });



}

//var dataz = localStorage.getItem('fbFilters');
var dataz = null;
if (dataz!==null) {

    console.log(dataz);
    const lux = JSON.parse(dataz);
    console.log(lux);
    populateWithRetrievedFilter(lux);

    
} else {

    //populateFilters();

}


var globalListeners = [];

function listListener (id,origKey,parentName){

    const currentVal = _fe.setScenarioSwitch(origKey,parentName);
    if (currentVal === undefined) { return; }
    const eli = document.getElementById(id);
    //this will happen automagically


    //console.log(id)
}

function parentListListener (parentName){

    const currentVal = _fe.setScenarioParentSwitch(parentName);
    if (currentVal === undefined) { return; }
    const eli = document.getElementById(parentName).parentNode.children;
    const lci = eli[eli.length - 1];
    //this will happen automagically
    if (currentVal) {
        lci.style.display = '';
    } else {
        lci.style.display = 'none';
    }

}


function entry(parentName,enableList) {

    //wrapper
    var items = [];
    var listeners = [];

    var parentListeners = [];

    var row = el('.row one filterSectionRow');

    Object.keys(enableList.list).forEach(function(key) {

        

        let m = enableList.list[key];
        if (m.length==undefined) {

            //enableList
            //<input name="employee" type="checkbox" value="Alex"/>
            var shoNam = parentName+'_'+key;
            let vx = m;
            
            var t = el('input.label',{
                //value : "realtime",
                id : shoNam,
                //innerHTML : a,
                type : 'checkbox',
                checked : vx,
                //value : vx //m
            })

            var t2 = el('label',{
                //value : "realtime",
                for : shoNam,
                innerHTML : key,
                type : 'label',
            })

            //row.appendChild(t);
            var slot =  el('.three columns');
            slot.appendChild(t2);
            slot.appendChild(t);

            listeners.push([shoNam,key,parentName]);
            items.push(slot);
            //items.push(t2);

        } else {




        }

       

    });

    while (x = items.shift()){
        row.appendChild(x);
    }        
    
    //insert the header
    var rowPre = el('.row one filterSection');

    var t = el('input.label',{
        //value : "realtime",
        id : parentName,
        innerHTML : parentName,
        type : 'checkbox',
        checked : enableList.onOff,
        //value : vx //m
    })

    var t2 = el('label',{
        //value : "realtime",
        for : parentName,
        innerHTML : parentName,
        type : 'label',
    })

    rowPre.appendChild(t2);
    rowPre.appendChild(t);
    rowPre.appendChild(row);
    

    var yNode = document.getElementById('filteringSections');

    
    yNode.insertBefore(rowPre, yNode.firstChild);

    var fufux = (function(b) {
        return function () { parentListListener(b); };
      })(parentName);

    //var fufu = (function(b){
    //    listListener(b[0],b[1])
    // })(a);
    document.getElementById(parentName).addEventListener("click", fufux);



    //attach listeners
    
    while (a=listeners.pop()){

        //document.getElementById(a[0]).addEventListener("click", listListener(a[0],a[1]) );
        
        var fufu = (function(b) {
            return function () { listListener(b[0],b[1],b[2]); };
          })(a);

        //var fufu = (function(b){
        //    listListener(b[0],b[1])
        // })(a);
        document.getElementById(a[0]).addEventListener("click", fufu);

        //globalListeners.push(fufu);
    //    listListener(a[0],a[1]) });
    }
    


    for (f=0; f<enableList.length; f++ ) {

        let item = enableList[f];

        if (item.length == 1) {

        } else {


        }



    }


}



function recipientEntry (o,key) {

    let email = o.email;
    let rtype = o.type;

    let s = el('input', { type: 'email', autofocus: false, value: email })
    /*let drp  = el('select#redom-logo.logo', {
        
        
      },el('option#',{
          value : "realtime",
          text : "realtime"
      }),el('option#tst',{
        value : "daily",
        text : "daily"
      }),el('option#tst',{
        value : "systemStatus",
        text : "system status"
    })


    );
    var lacoNo = 'sel_'+key;
    //const lxco = el('.row',  el ('.six columns',
    const lxco = el ('.six columns',
         el('label.label',{
            //value : "realtime",
            for : lacoNo+"_e",
            innerHTML : "email adress"
        }),
        el('input#'+lacoNo+"_e", { type: 'email', autofocus: false, value: email })
        );


    const laco =   el ('.six columns',
        el('label.label',{
            //value : "realtime",
            for : lacoNo,
            innerHTML : "report type to recieve"
        }),el('select#'+lacoNo+'.u-full-width', {
            },el('option#',{
            value : "realtime",
            text : "realtime"
            }),el('option#',{
          value : "daily",
          text : "daily"
            }),el('option#',{
          value : "admin",
          text : "system status"
        })
    ));
    
    const row = el('.row');

    var yNode = document.getElementById('listForm');
    yNode.insertBefore(row, yNode.firstChild);

    row.insertBefore(laco, row.firstChild);
    row.insertBefore(lxco, row.firstChild);
    var t = document.getElementById(lacoNo).value = o.type;
    var td = document.getElementById(lacoNo+"_e").value = o.email;
    
    return;
    */
}


function saveFilter() {
    console.log("savefuil");
    //save filter on backend
    const sw = _fe.getScenarioSwitches();
    const ou = JSON.stringify(sw);
    localStorage.setItem('fbFilters', ou);

    var request = new XMLHttpRequest();
        request.open('POST', '/saveFilter', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(ou);


    alert("Filter saved");
   
}

function loadFilter(filterType) {
    
    var request = new XMLHttpRequest();
    request.open('GET', '/getFilter?type='+filterType, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        //set auth cookie
        var data = JSON.parse(request.responseText);
        if (data.type!==filterType){
          //prompt('error pulling '+filterType+' filter');
            populateFilters();

        } else {
          
            populateWithRetrievedFilter(data);

         //setTimeout(() => window.location = '/serviceStatus', 300);
        }

      } else {
        // We reached our target server, but it returned an error
            console.log("request error");
            populateFilters();
        }
     };

    request.onerror = function() {
      // There was a connection error of some sort
      console.log("request onerror");
      populateFilters();
      
    };

    request.send();
}

let df = {'jey':'jal'};
let g = Object.keys(df);
console.log(g[0]);


function testFilter(){
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

    setTimeout(() => window.open('http://localhost:8081/daily'), 300);

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

    setTimeout(() => window.open('http://localhost:8081/totalErrors'), 300);

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

function DEPREdeviceErrors(){
    console.log("deviceErrors");
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

    setTimeout(() => window.open('http://localhost:8081/deviceErrors'), 300);

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



//updateServiceStatuses();

loadFilter('daily');

function onloado() {
    console.log("loaded");
}

function ready(onloado) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
      onloado();
    } else {
      document.addEventListener('DOMContentLoaded', onloado);
    }
  }
