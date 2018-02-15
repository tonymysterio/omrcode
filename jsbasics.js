
//TODO read jsondatas
let jsonData = '{"dirty":false,"device_registration":{"onOff":false,"dirty":true,"list":{"company_code":true,"branch_code":true,"device_code":true,"status":["info","warn","error","fatal"],"error_info":true,"device_type":true,"device_nickname":true,"serial_no":true,"serial_date":true,"action":false,"value":true}},"device_setting":{"onOff":false,"dirty":false,"list":{"company_code":true,"branch_code":true,"device_code":true,"status":["info","warn","error","fatal"],"error_info":true,"device_type":true,"device_nickname":true,"serial_no":true,"serial_date":true,"action":["device_set","datetime_update","device_delete","device_change_name"],"value":true}},"data_transfering":{"onOff":false,"dirty":false,"list":{"company_code":true,"branch_code":true,"device_code":true,"status":["info","warn","error","fatal"],"error_info":true,"device_type":true,"device_nickname":true,"serial_no":true,"serial_date":true,"action":["data_transfer","data_cloud_sync"],"value":true}},"device_statistics":{"onOff":true,"dirty":false,"list":{"company_code":true,"branch_code":true,"device_code":true,"status":true,"error_info":true,"device_type":true,"device_nickname":true,"serial_no":true,"serial_date":true,"action":["serial_data_overflow_detection","checksum_error_detection","timezone_change_detection","time_difference_detection"],"value":true}},"app_setting":{"onOff":true,"dirty":false,"list":{"company_code":false,"branch_code":false,"device_code":true,"status":["info","warn","error","fatal"],"error_info":false,"app_version":false,"def_file_version":true,"action":["app_update","definition_update"],"value":true}},"type":"daily","timestamp":123}';

let a = JSON.parse(jsonData);

console.log(a);

//process.exit(); //

/*
let a = {
    type : 'car',
    color : 'blue',
    numbers : [0,1,2,3,4,5]

}*/



Object.keys(a).forEach(function(key) {
    
    console.log('key '+key);
    let v = a[key];
    console.log('value '+v);
    console.log('kata '+typeof v);
    if ( v instanceof Array ) {

        console.log('array found!');

        for(f=0;f<v.length;f++){
            var item = v[f];
            console.log(item);
        }
    }



});

//task2

var milliseconds = Math.floor((new Date).getTime()/1000); 
var milliseconds = (new Date).getTime()*1000;

console.log(milliseconds);
console.log("1513069313600002");

//SELECT event_dim_date,event_dim_timestamp_micros,event_dim_name
//event_dim_params_key,event_dim_params_value_string_value,event_dim_params_value_int_value
//user_dim_device_info_mobile_model_name,user_dim_device_info_device_id,user_dim_device_info_platform_version
//user_dim_app_info_app_instance_id

//WHERE user_dim_name ="device_registeration" and event_dim_params_key="company_code"



//{"event_dim_date":"20171212",
//"event_dim_timestamp_micros":"1513069313600002",

//WHERE event_dim_name = "app_setting" AND (event_dim_params_key = "device_code" OR event_dim_params_key = "status"
//OR event_dim_params_key = "def_file_version" //event_dim_name = "app_setting"

 
//"event_dim_name":"user_engagement",
//"event_dim_params_key":"engagement_time_msec",
//"event_dim_params_value_string_value":null,
//"event_dim_params_value_int_value":"1788",

//"user_dim_device_info_mobile_model_name":"iPad",
//"user_dim_device_info_device_id":null,
//"user_dim_device_info_platform_version":"11.1",
//"user_dim_app_info_app_id":"jp.co.omron.healthcare.omron-connect.pro",
//"user_dim_app_info_app_instance_id":"911DB28922F34F73A41525C3AA6DA2ED"}

//pull bigQuery 