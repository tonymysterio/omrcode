
//turns the filter into query

function filterAdaptor() {

    this.scenarios = {};
    this.switches = {};
    this.type = 'daily'; //realtime
    this.timestamp = 0;
    this.mappings = {
    'app_setting' : "event_dim_name",
    'data_transfering' : "event_dim_name",
    'device_registeration' : "event_dim_name",
    'device_setting' : "event_dim_name",
    'device_statistics' : "event_dim_name",
    'company_code' : "event_dim_params_key",
    'branch_code' : "event_dim_params_key",
    'device_code' : "event_dim_params_key",
    //'status' : ['info','warn','error','fatal'],
    'status' : "event_dim_params_key",
    'error_info' : "event_dim_params_key",
    'device_type' : "event_dim_params_key",
    'device_nickname' : "event_dim_params_key",
    'serial_no' : "event_dim_params_key",
    'serial_date' : "event_dim_params_key",
    'action' : "event_dim_params_key",
    //'action' : ['device_set','datetime_update','device_delete','device_change_name'],
    'value' : "event_dim_params_value_string_value"

    }

    this.groupItems = {};
}

filterAdaptor.prototype.convertSQLreplyToEntry = function(o){

    //user_dim_app_info_app_instance_id
    let gid = o.user_dim_app_info_app_instance_id;

    if ( this.groupItems[gid]==undefined) {
        //group by timestamps?
        this.groupItems[gid] = {};
        this.groupItems[gid].list =[];

    }

    this.groupItems[gid].list.push(o);
    
    switch (o.event_dim_params_key) {

        case 'company_code':
        this.groupItems[gid].company_code = o.event_dim_params_value_string_value;
        case 'branch_code':
        this.groupItems[gid].branch_code = o.event_dim_params_value_string_value;
        case 'serial_date':
        this.groupItems[gid].serial_date = o.event_dim_params_value_string_value;
        case 'serial_no':
        this.groupItems[gid].serial_no = o.event_dim_params_value_string_value;
        case 'device_code':
        this.groupItems[gid].device_code = o.event_dim_params_value_string_value;
        case 'device_type':
        this.groupItems[gid].device_type = o.event_dim_params_value_string_value;
        case 'status':
        this.groupItems[gid].status = o.event_dim_params_value_string_value;
        case 'error_info':
        this.groupItems[gid].error_info = o.event_dim_params_value_string_value;
        
        //case 'action':
        //this.groupItems[gid].status = o.event_dim_params_value_string_value;

        /*'app_setting' : "event_dim_name",
        'data_transfering' : "event_dim_name",
        'device_registeration' : "event_dim_name",
        '   device_setting' : "event_dim_name",
        'device_statistics' : "event_dim_name",
       'device_nickname' : "event_dim_params_key",
        'action' : ['device_set','datetime_update','device_delete','device_change_name'],
        'value' : "event_dim_params_value_string_value"*/

    }


    
    /*
event_dim_date
:
"20171212"
event_dim_name
:
"data_transfering"
event_dim_params_key
:
"device_code"
event_dim_params_value_int_value
:
null
event_dim_params_value_string_value
:
"585F4F2B-92CF-4096-9A61-8DC55AAF386A"
event_dim_timestamp_micros
:
"1513069329393010"
user_dim_app_info_app_id
:
"jp.co.omron.healthcare.omron-connect.pro"
user_dim_app_info_app_instance_id
:
"911DB28922F34F73A41525C3AA6DA2ED"
user_dim_device_info_device_id
:
null
user_dim_device_info_mobile_model_name
:
"iPad"
user_dim_device_info_platform_version
:
"11.1"
user_dim_geo_info_city
:
"Shinjuku"
user_dim_geo_info_region
:
"Tokyo"?*/


}

filterAdaptor.readEntries = function(){

    this.groupItems[gid] = {};
    this.groupItems[gid].list =[];

    var ent = [];


}

filterAdaptor.readEntryParentAndEntries = function(par){

    let ents = [];  
    

}


filterAdaptor.prototype.convertToLookForArray = function(filter){

    //loop and skip non objects
    const me=this;

    var blocks =[];
    var blockKeys1 =[];

    Object.keys(filter).forEach(function(key) {
        
        const r = filter[key];
        if (typeof r !== 'object') {
            return;
        }

        var block =[];
        //level 1
        const p = me.mappings[key];
        if (p===undefined) { return; }
        if (r.list === undefined) { return; }
        console.log('----------');
        //console.log(r);
        //block.push([p,key]) //event_dim_name : app setting
        
        Object.keys(r.list).forEach(function(key2) {
            
            if (key=='device_statistics') {
                lummox=1;
            }

            const r2 = r.list[key2];
            if (typeof r2 !== 'object') {
                
                console.log("lookign "+key2+' for '+key+ ' '+r2)
                if (!r2) { return; }
                const pp = me.mappings[key2];

                if (r2) {
                    //true value, we want this
                    if (pp!==undefined){

                        block.push([pp,key2])

                    } else {
                        console.log("missing "+key2+' for '+key)
                    }

                }

            } else {

                //its an object like action or status, look deeper
                console.log(key+' ZONSU '+key2);
                const pp = me.mappings[key2];
                //console.log(me.mappings);
                //process.exit();
                //console.log(r2)
                //causes to observe all kinds of statuses!! ALERT
                block.push([pp,[key2,r2]])
            }

            


        });

        if (block.length) {
            block.unshift([p,key]) //event_dim_name : app setting
            blocks.push(block);
        }
        

    });

    //console.log(blocks);
    //process.exit();

    if (blocks.length) { return blocks; }

    return false;


}   //end convertToLookForArray

filterAdaptor.prototype.simplifyQueryArray = function(queryArray){

    //first entry is eventdimname, second on eventdimparams key
    var queriedEvents = [];
    var queriedEventTypes = [];

    for (f=0; f<queryArray.length; f++){

        queriedEvents.push(queryArray[f][0][1]);
        
            //for (ff=1; f<queryArray[f].length; ff++){
            //queryArray[f].unshift();
            while (a=queryArray[f].pop()){
                //console.log(f+' '+ff)
                //if (queryArray[f][ff]!==undefined){
                    queriedEventTypes.push(a[1]);
                //}
                
            }
        
        
    }

    console.log(queriedEvents);
    console.log(queriedEventTypes);
}



filterAdaptor.prototype.queryMockDataWithQueryArray = function(mockData, queryArray){


  }

  Array.prototype.unique = function() {
    return this.filter(function (value, index, self) { 
      return self.indexOf(value) === index;
    });
  }

module.exports = filterAdaptor;

/*
console.log("SIDA");
var jso ='{"dirty":false,"device_registration":{"onOff":true,"dirty":false,"list":{"company_code":true,"branch_code":false,"device_code":true,"status":{"info":true,"warn":false,"error":false,"fatal":false},"error_info":false,"device_type":false,"device_nickname":false,"serial_no":false,"serial_date":false,"action":false,"value":false}},"device_setting":{"onOff":true,"dirty":false,"list":{"company_code":false,"branch_code":false,"device_code":false,"status":{"info":false,"warn":false,"error":false,"fatal":false},"error_info":false,"device_type":false,"device_nickname":false,"serial_no":false,"serial_date":false,"action":{"device_set":false,"datetime_update":false,"device_delete":false,"device_change_name":false},"value":false}},"data_transfering":{"onOff":true,"dirty":true,"list":{"company_code":false,"branch_code":false,"device_code":true,"status":{"info":false,"warn":false,"error":false,"fatal":false},"error_info":false,"device_type":false,"device_nickname":false,"serial_no":false,"serial_date":false,"action":{"data_transfer":false,"data_cloud_sync":false},"value":false}},"device_statistics":{"onOff":true,"dirty":true,"list":{"company_code":true,"branch_code":true,"device_code":true,"status":true,"error_info":true,"device_type":true,"device_nickname":true,"serial_no":true,"serial_date":false,"action":{"serial_data_overflow_detection":false,"checksum_error_detection":false,"timezone_change_detection":false,"time_difference_detection":false},"value":false}},"app_setting":{"onOff":true,"dirty":true,"list":{"company_code":true,"branch_code":false,"device_code":false,"status":{"info":false,"warn":false,"error":false,"fatal":false},"error_info":false,"app_version":false,"def_file_version":false,"action":{"app_update":false,"definition_update":false},"value":false}},"type":"daily","timestamp":123}';

var _fap = new filterAdaptor();
if (lookArray = _fap.convertToLookForArray(JSON.parse(jso))){
    console.log(JSON.stringify(lookArray));
    //return;
    //const queryArray = _fap.simplifyQueryArray(lookArray);

    //_fap.queryMockDataWithQueryArray(_mockData,queryArray)
    console.log(lookArray);

}
*/