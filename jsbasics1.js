
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

function putInQuotes(text) {

    return "\"" + text + "\"";

}

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
    
    if(key=='app_setting') //app_setting
    {//app_setting
    if(v instanceof Object){
        Object.keys(v).forEach(function(key) {
            console.log('O_key '+key);
            let ov=v[key];
            console.log('O_value '+ov);
            console.log('O_kata '+typeof ov);
            if(ov instanceof Object){
                Object.keys(ov).forEach(function(key) {
                    console.log('List_key '+key);
                    let listv=ov[key];
                    console.log('List_value '+listv);
                    console.log('List_kata '+typeof listv);
                });
            }
        });
    }
    }//app_setting
});


wh='';
aheadBlock=false;//Trueなら前にWhereブロック句有り（') OR 'を最初につける必要あり有り
aheadBlockClose=false;  //前のブロックの閉じカッコ
Object.keys(a).forEach(function(key) {
    let v = a[key];
 
    switch(key)
    {
        case 'app_setting':
            headerWrite=false;  //Trueなら前に条件句有り(' or 'を前につける必要あり)
            proceed=false;  //Trueなら編集対象
            if(v instanceof Object){
                Object.keys(v).some(function(key0) {
                    if(key0=='onOff')
                    {
                        if(v[key0]){
                            proceed=true;
                            return;
                        }
                    }
                });
            }
            if(proceed)
            {
                console.log(' app_setting OnOFF On');
                Object.keys(v).forEach(function(key0) {
                    if(key0=='list')
                    {
                        let ov=v[key0];
                        if(ov instanceof Object){
                            console.log('----- app_setting OnOFF loop1----'+key0);
                            Object.keys(ov).forEach(function(key1) {
                                if(ov instanceof Object){
                                    console.log('----- app_setting OnOFF loop2----'+key1);
                                    //Object.keys(ov).forEach(function(key2) {
                                        let listv=ov[key1];
                                        console.log('**********'+key1+' value:'+listv);
                                        if(key1=='status' || key1=='status')
                                        {
                                            console.log('*****1******');
                                            //無条件に追加
                                            if(!headerWrite)
                                            {
                                                if(aheadBlock){
                                                    if(!aheadBlockClose){
                                                    wh+=') OR '; //前のブロック有り
                                                    aheadBlockClose=true;
                                                    console.log('*****2******');
                                                    }
                                                }
                                                //最初なのでHeaderを付ける
                                                headerWrite=true;
                                                wh+='event_dim.name = "app_setting" AND (';
                                                wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                aheadBlock=true;
                                                aheadBlockClose=false; 
                                                console.log('*****3******'+ key1);
                                            }
                                            else
                                            {
                                                if(headerWrite) wh+=' OR '; //前の条件有り
                                                wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                aheadBlockClose=false; 
                                                console.log('*****4******'+ key1);
                                            }
                                        
                                        }
                                        else
                                        {
                                            //Trueなら追加
                                            if(listv==true)
                                            {
                                                console.log('*****5******'+listv+' key:'+key);
                                                if(!headerWrite)
                                                {
                                                    if(aheadBlock){
                                                        if(!aheadBlockClose){
                                                        wh+=') OR '; //前のブロック有り
                                                        aheadBlockClose=true;
                                                        console.log('*****6******');
                                                        }
                                                    }
                                                    //最初なのでHeaderを付ける
                                                    headerWrite=true;
                                                    wh+='event_dim.name = "app_setting" AND (';
                                                    wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                    aheadBlock=true;
                                                    aheadBlockClose=false; 
                                                    console.log('*****7******'+ key1);
                                                }
                                                else
                                                {
                                                    if(headerWrite) wh+=' OR '; //前の条件有り
                                                    wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                    aheadBlockClose=false; 
                                                    console.log('*****8******'+ key1);
                                                }
                                            }
                                        }
                                    //});
                                }
                            });
                        }
                    }
                });
            }
            break;

        case 'device_statistics':
            headerWrite=false;  //Trueなら前に条件句有り(' or 'を前につける必要あり)
            proceed=false;  //Trueなら編集対象
            if(v instanceof Object){
                Object.keys(v).some(function(key) {
                    if(key=='onOff')
                    {
                        if(v[key]){
                            proceed=true;
                            return;
                        }
                    }
                });
            }
            if(proceed)
            {
                console.log('device_statistics OnOFF On');
                Object.keys(v).forEach(function(key0) {
                    if(key0=='list')
                    {
                        let ov=v[key0];
                        if(ov instanceof Object){
                            console.log('----- device_statistics OnOFF loop1----'+key0);
                            Object.keys(ov).forEach(function(key1) {
                                if(ov instanceof Object){
                                    console.log('----- device_statistics OnOFF loop2----'+key1);
                                    //Object.keys(ov).forEach(function(key2) {
                                        let listv=ov[key1];
                                        console.log('**********'+key1+' value:'+listv);
                                        if(key1=='status' || key1=='status')
                                        {
                                            console.log('*****1******');
                                            //無条件に追加
                                            if(!headerWrite)
                                            {
                                                if(aheadBlock){
                                                    if(!aheadBlockClose){
                                                    wh+=') OR '; //前のブロック有り
                                                    aheadBlockClose=true;
                                                    console.log('*****2******');
                                                    }
                                                }
                                                //最初なのでHeaderを付ける
                                                headerWrite=true;
                                                wh+='event_dim.name = "device_statistics" AND (';
                                                wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                aheadBlock=true;
                                                console.log('*****3******'+ key1);
                                                aheadBlockClose=false; 
                                            }
                                            else
                                            {
                                                if(headerWrite) wh+=' OR '; //前の条件有り
                                                wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                aheadBlockClose=false; 
                                                console.log('*****4******'+ key1);
                                            }
                                        
                                        }
                                        else
                                        {
                                            //Trueなら追加
                                            if(listv==true)
                                            {
                                                console.log('*****5******'+listv+' key:'+key);
                                                if(!headerWrite)
                                                {
                                                    if(aheadBlock){
                                                        if(!aheadBlockClose){
                                                        wh+=') OR '; //前のブロック有り
                                                        aheadBlockClose=true;
                                                        console.log('*****6******');
                                                        }
                                                    }
                                                    //最初なのでHeaderを付ける
                                                    headerWrite=true;
                                                    wh+='event_dim.name = "device_statistics" AND (';
                                                    wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                    aheadBlock=true;
                                                    aheadBlockClose=false; 
                                                    console.log('*****7******'+ key1);
                                                }
                                                else
                                                {
                                                    if(headerWrite) wh+=' OR '; //前の条件有り
                                                    wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                    aheadBlockClose=false; 
                                                    console.log('*****8******'+ key1);
                                                }
                                            }
                                        }
                                    //});
                                }
                            });
                        }
                    }
                });
            }
            break;
        case 'data_transfering':
            headerWrite=false;
            proceed=false;
            if(v instanceof Object){
                Object.keys(v).some(function(key) {
                    if(key=='onOff')
                    {
                        if(v[key]){
                            proceed=true;
                            return;
                        }
                    }
                });
            }
            if(proceed)
            {
                console.log('data_transfering OnOFF On');
                Object.keys(v).forEach(function(key0) {
                    if(key0=='list')
                    {
                        let ov=v[key0];
                        if(ov instanceof Object){
                            console.log('----- data_transfering OnOFF loop1----'+key0);
                            Object.keys(ov).forEach(function(key1) {
                                if(ov instanceof Object){
                                    console.log('----- data_transfering OnOFF loop2----'+key1);
                                    //Object.keys(ov).forEach(function(key2) {
                                        let listv=ov[key1];
                                        console.log('**********'+key1+' value:'+listv);
                                        if(key1=='status' || key1=='status')
                                        {
                                            console.log('*****1******');
                                            //無条件に追加
                                            if(!headerWrite)
                                            {
                                                if(aheadBlock){
                                                    if(!aheadBlockClose){
                                                    wh+=') OR '; //前のブロック有り
                                                    aheadBlockClose=true;
                                                    console.log('*****2******');
                                                    }
                                                }
                                                //最初なのでHeaderを付ける
                                                headerWrite=true;
                                                wh+='event_dim.name = "data_transfering" AND (';
                                                wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                aheadBlock=true;
                                                aheadBlockClose=false; 
                                                console.log('*****3******'+ key1);
                                            }
                                            else
                                            {
                                                if(headerWrite) wh+=' OR '; //前の条件有り
                                                wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                aheadBlockClose=false; 
                                                console.log('*****4******'+ key1);
                                            }
                                        
                                        }
                                        else
                                        {
                                            //Trueなら追加
                                            if(listv==true)
                                            {
                                                console.log('*****5******'+listv+' key:'+key);
                                                if(!headerWrite)
                                                {
                                                    if(aheadBlock){
                                                        if(!aheadBlockClose){
                                                        wh+=') OR '; //前のブロック有り
                                                        aheadBlockClose=true;
                                                        console.log('*****6******');
                                                        }
                                                    }
                                                    //最初なのでHeaderを付ける
                                                    headerWrite=true;
                                                    wh+='event_dim.name = "data_transfering" AND (';
                                                    wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                    aheadBlock=true;
                                                    aheadBlockClose=false; 
                                                    console.log('*****7******'+ key1);
                                                }
                                                else
                                                {
                                                    if(headerWrite) wh+=' OR '; //前の条件有り
                                                    wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                    aheadBlockClose=false; 
                                                    console.log('*****8******'+ key1);
                                                }
                                            }
                                        }
                                    //});
                                }
                            });
                        }
                    }
                });
            }
            break;
        case 'device_setting':
            headerWrite=false;
            proceed=false;
            if(v instanceof Object){
                Object.keys(v).some(function(key) {
                    if(key=='onOff')
                    {
                        if(v[key]){
                            proceed=true;
                            return;
                        }
                    }
                });
            }
            if(proceed)
            {
                console.log('device_setting OnOFF On');
                Object.keys(v).forEach(function(key0) {
                    if(key0=='list')
                    {
                        let ov=v[key0];
                        if(ov instanceof Object){
                            console.log('----- device_setting OnOFF loop1----'+key0);
                            Object.keys(ov).forEach(function(key1) {
                                if(ov instanceof Object){
                                    console.log('----- device_setting OnOFF loop2----'+key1);
                                    //Object.keys(ov).forEach(function(key2) {
                                        let listv=ov[key1];
                                        console.log('**********'+key1+' value:'+listv);
                                        if(key1=='status' || key1=='status')
                                        {
                                            console.log('*****1******');
                                            //無条件に追加
                                            if(!headerWrite)
                                            {
                                                if(aheadBlock){
                                                    if(!aheadBlockClose){
                                                    wh+=') OR '; //前のブロック有り
                                                    aheadBlockClose=true;
                                                    console.log('*****2******');
                                                    }
                                                }
                                                //最初なのでHeaderを付ける
                                                headerWrite=true;
                                                wh+='event_dim.name = "device_setting" AND (';
                                                wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                aheadBlock=true;
                                                aheadBlockClose=false; 
                                                console.log('*****3******'+ key1);
                                            }
                                            else
                                            {
                                                if(headerWrite) wh+=' OR '; //前の条件有り
                                                wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                aheadBlockClose=false; 
                                                console.log('*****4******'+ key1);
                                            }
                                        
                                        }
                                        else
                                        {
                                            //Trueなら追加
                                            if(listv==true)
                                            {
                                                console.log('*****5******'+listv+' key:'+key);
                                                if(!headerWrite)
                                                {
                                                    if(aheadBlock){
                                                        if(!aheadBlockClose){
                                                        wh+=') OR '; //前のブロック有り
                                                        aheadBlockClose=true;
                                                        console.log('*****6******');
                                                        }
                                                    }
                                                    //最初なのでHeaderを付ける
                                                    headerWrite=true;
                                                    wh+='event_dim.name = "device_setting" AND (';
                                                    wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                    aheadBlock=true;
                                                    aheadBlockClose=false; 
                                                    console.log('*****7******'+ key1);
                                                }
                                                else
                                                {
                                                    if(headerWrite) wh+=' OR '; //前の条件有り
                                                    wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                    aheadBlockClose=false; 
                                                    console.log('*****8******'+ key1);
                                                }
                                            }
                                        }
                                    //});
                                }
                            });
                        }
                    }
                });
            }
            break;
        case 'device_registration':
            headerWrite=false;
            proceed=false;
            if(v instanceof Object){
                Object.keys(v).some(function(key) {
                    if(key=='onOff')
                    {
                        if(v[key]){
                            proceed=true;
                            return;
                        }
                    }
                });
            }
            if(proceed)
            {
                console.log('device_registration OnOFF On');
                Object.keys(v).forEach(function(key0) {
                    if(key0=='list')
                    {
                        let ov=v[key0];
                        if(ov instanceof Object){
                            console.log('----- device_registration OnOFF loop1----'+key0);
                            Object.keys(ov).forEach(function(key1) {
                                if(ov instanceof Object){
                                    console.log('----- device_registration OnOFF loop2----'+key1);
                                    //Object.keys(ov).forEach(function(key2) {
                                        let listv=ov[key1];
                                        console.log('**********'+key1+' value:'+listv);
                                        if(key1=='status' || key1=='status')
                                        {
                                            console.log('*****1******');
                                            //無条件に追加
                                            if(!headerWrite)
                                            {
                                                if(aheadBlock){
                                                    if(!aheadBlockClose){
                                                    wh+=') OR '; //前のブロック有り
                                                    aheadBlockClose=true;
                                                    console.log('*****2******');
                                                    }
                                                }
                                                //最初なのでHeaderを付ける
                                                headerWrite=true;
                                                wh+='event_dim.name = "device_registration" AND (';
                                                wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                aheadBlock=true;
                                                aheadBlockClose=false; 
                                                console.log('*****3******'+ key1);
                                            }
                                            else
                                            {
                                                if(headerWrite) wh+=' OR '; //前の条件有り
                                                wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                aheadBlockClose=false; 
                                                console.log('*****4******'+ key1);
                                            }
                                        
                                        }
                                        else
                                        {
                                            //Trueなら追加
                                            if(listv==true)
                                            {
                                                console.log('*****5******'+listv+' key:'+key);
                                                if(!headerWrite)
                                                {
                                                    if(aheadBlock){
                                                        if(!aheadBlockClose){
                                                        wh+=') OR '; //前のブロック有り
                                                        aheadBlockClose=true;
                                                        console.log('*****6******');
                                                        }
                                                    }
                                                    //最初なのでHeaderを付ける
                                                    headerWrite=true;
                                                    wh+='event_dim.name = "device_registration" AND (';
                                                    wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                    aheadBlock=true;
                                                    aheadBlockClose=false; 
                                                    console.log('*****7******'+ key1);
                                                }
                                                else
                                                {
                                                    if(headerWrite) wh+=' OR '; //前の条件有り
                                                    wh+='event_dim.params.key = '+ putInQuotes(key1);
                                                    aheadBlockClose=false; 
                                                    console.log('*****8******'+ key1);
                                                }
                                            }
                                        }
                                    //});
                                }
                            });
                        }
                    }
                });
            }
        break;
        default:
            break;
    }
});
if(wh.length>0) wh+=')';
console.log('SELECT event_dim.date, event_dim.timestamp_micros, event_dim.name, event_dim.params.key, event_dim.params.value.string_value, event_dim.params.value.int_value FROM jp_co_omron_healthcare_omron_connect_pro_IOS.app_events_20171127 WHERE '+wh);

var sqlQuery =' SELECT event_dim.date, event_dim.timestamp_micros, event_dim.name, event_dim.params.key, event_dim.params.value.string_value, event_dim.params.value.int_value FROM jp_co_omron_healthcare_omron_connect_pro_IOS.app_events_20171127 WHERE '+wh;
sqlQuery = sqlQuery + " ";
sqlQuery = sqlQuery + " ";
sqlQuery = sqlQuery + " ";
sqlQuery = sqlQuery + " ";
sqlQuery = sqlQuery + " ";

const BigQuery = require('@google-cloud/bigquery');

const sqlQueryXX =`
WITH data AS (
 SELECT "primes under 15" AS description,
 [1,2,3,5,7,11,13] AS primes_array)
 SELECT 
 user_dim.user_id, 
 user_dim.first_open_timestamp_micros,
 user_dim.device_info.device_category,user_dim.device_info.mobile_model_name 
 FROM jp_co_omron_healthcare_omron_connect_pro_IOS.app_events_20171212
`;

// Instantiates a client
const bigquery = BigQuery({projectId:'omron-connect-for-development'});

// Query options list: https://cloud.google.com/bigquery/docs/reference/v2/jobs/query
const options = {
  query: sqlQuery,
  useLegacySql: true // Use standard SQL syntax for queries.
};

// Runs the query
bigquery
  .query(options)
  .then((results) => {
    const rows = results[0];
    console.log(rows);
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });