
const { el, mount ,setChildren, setAttr } = redom;
//update 

//var _ps = new _processSettings();
//var _ss = new _serviceStatus();

var _ps = new _processSettings();


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


    );*/
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


    const laco =   el ('.three columns',
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

    const bubu = el ('.three columns',
    el('label.label',{
        //value : "realtime",
        
        innerHTML : ""
    }),

    el('button#'+lacoNo+"_b .button-primary align-to-bottom", { type: 'submit',innerHTML : "remove" }));
         
    

    
    
    const row = el('.row');

    var yNode = document.getElementById('listForm');
    yNode.insertBefore(row, yNode.firstChild);

    row.insertBefore(bubu, row.firstChild);
    row.insertBefore(laco, row.firstChild);
    row.insertBefore(lxco, row.firstChild);
    
    var t = document.getElementById(lacoNo).value = o.type;
    var td = document.getElementById(lacoNo+"_e").value = o.email;
    
    //let buli = lacoNo+"_b";

    //var fufu = (function(bali) {
    //        return function () { removeButton(bali); };
   //     })(buli);

    //let narb = document.getElementById(buli);
    //document.getElementById(buli).addEventListener("click", fufu);

    

    return;

}

function removeButton(laco) {
    console.log(laco);
    let but = document.getElementById(laco);
    let papa = but.parentNode.parentNode;
    

    var r = confirm("remove item?");
    if (r == true) {
        papa.parentNode.removeChild(papa);

    } else {
        return;
    }

}

function updateProcessSettings(data) {

    //#serviceStatus
    /*Object.keys(obj).forEach(function(key) {
        console.log(key, obj[key]);
    });*/

    

    /*var myNode = document.getElementById("serviceStatus");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }*/
    var yNode = document.getElementById('formList');
    if (data===undefined){

        data = _ps.mailRecipients();

    }

    Object.keys(data).forEach(function(key) {
        console.log(key, _ps.mailRecipients[key]);

        var nb = recipientEntry(data[key],key);
        /*
        var yNode = document.getElementById(key);
        console.log(yNode);
        let tw = timeConverter(_ss.statusHistory[key].timestamp)
        yNode.innerHTML = tw;*/
    });

    attachRemoveButtonListeners();
}

loadSettings();

function attachRemoveButtonListeners(){
    //let buli = lacoNo+"_b";

    //var fufu = (function(bali) {
    //        return function () { removeButton(bali); };
   //     })(buli);

    //let narb = document.getElementById(buli);
    //document.getElementById(buli).addEventListener("click", fufu);
    var elements = document.querySelectorAll('button');
    console.log(elements);

    //email: "daily2@test.com", type: "daily", timestamp: 12341324}
    
        Array.prototype.forEach.call(elements, function(el, i){

            var no = [];
            if(el.id.substring(0,3)=='sel'){
                
            var fufu = (function(bali) {
                return function () { removeButton(bali); };
             })(el.id);

                el.addEventListener("click", fufu);

            }

        });

        var dild =1;


}
 
    

function addRecipient () {

    var nb = recipientEntry({email:"",type:"daily"},false);

    alert("addRecipient")

}

function requestRealtime () {

    alert("requestRealtime")

}

//sel_1_e

//updateServiceStatuses();

function getSettingsSwitches (){

    //look thru the form and make _ps.mailRecipients like object
    var elements = document.querySelectorAll('input');
    var emails = [];
    

    //email: "daily2@test.com", type: "daily", timestamp: 12341324}
    
        Array.prototype.forEach.call(elements, function(el, i){

            var no = [];
            if(el.id.substring(0,3)=='sel'){
                
                emails.push (el.value);

            }

        });

        var dild =1;
    
        var elements = document.querySelectorAll('select');
        
        console.log(elements);
        var types = [];

        Array.prototype.forEach.call(elements, function(el, i){

            var no = [];
            if(el.id.substring(0,3)=='sel'){
                
                types.push (el.value);

            }

        });

        var combined = {};
        var comCa = 0;
        for( f=0 ; f < emails.length ; f++){
            combined[f]={email:emails[f],type:types[f],timestamp:0};

        }
        
        return combined;

}

function saveSettings(){

    var items = getSettingsSwitches();

    var request = new XMLHttpRequest();
    
    request.open('POST', '/saveSettings', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    
    request.onreadystatechange = function(){
        if (request.readyState == 4 && request.status == 200){
            alert("settings saved!");
        }
    }
    
    request.send(JSON.stringify(items));

    return false;
}

function loadSettings() {
    
    var request = new XMLHttpRequest();
    request.open('GET', '/getSettings', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        //set auth cookie
        var data = JSON.parse(request.responseText);
        updateProcessSettings(data);

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