//event_dim_date	event_dim_timestamp_micros	event_dim_name	
//event_dim_params_key	event_dim_params_value_string_value	
//event_dim_params_value_int_value	user_dim_device_info_mobile_model_name
//user_dim_device_info_device_id	user_dim_device_info_platform_version
//user_dim_app_info_app_id	user_dim_geo_info_region
//user_dim_geo_info_city	user_dim_app_info_app_instance_id

function filterFields() {

    //constructor(name) {
      
      //event name comes from  event_dim_name
      this.eventNames=['device_registration','device_setting','data_transfering','device_statistics','app_setting']

      //data_transfering messages that can help uniquely idetifying a device
        //serial_no
        //serial_date
        //device_code
        //device_nickname
        //company_code

      //event_dim_params_key
      this.eventKeys = ['company_code','branch_code','device_code','status','error_info','device_type','device_nickname'
      ,'serial_no','serial_date','action','value','app_version','def_file_version'];
        //event_dim_params_value_string_value	
      this.status = ['info','warn','error','fatal'];
    this.action =['device_regist','device_set','datetime_update','device_delete','device_change_name',
    'data_transfer','data_cloud_sync','serial_date_reset_detection','serial_date_overflow_detection','checksum_error_detection',
    'app_update','definition_update'];
        this.anomalities = [];
        this.ignoredkeys0 = {};
        this.ignoredSubkeys1 = {};

        this.trackedEntryKeys = ['device_type','device_code','device_nickname','company_code','serial_no','serial_date'];
        this.trackedEntries = []

        //debug data, extract from actual data
    }
    
    //event 

    filterFields.prototype.reportIgnored = function(){

        console.log('report ignored ------');
        //console.log(this.ignoredkeys0);

        Object.keys(this.ignoredkeys0).forEach(function(key) {
            //var val = this.ignoredkeys0[key];
            console.log(key);
          });

          console.log('report ignored subkeys------');

          Object.keys(this.ignoredSubkeys1).forEach(function(key) {
            //var val = this.ignoredkeys0[key];
            console.log(key);
          });

    }

    filterFields.prototype.analyzeKeysFromData = function(data) {
        
            while (line=data.pop()){

                if (ak = this.analyzeKeys(line)){
                    //add to list


                }
            
            }

        }

    filterFields.prototype.addToAccepted = function (event_dim_name , lineoParsed , lineo ){
        
        //increasin time order

        let fingerPrint = this.deductIndividualUser(lineo, lineoParsed )
    }

    filterFields.prototype.deductIndividualUser = function(lineoParsed) {

        //combine user hash
        /* user_dim_device_info_platform_version: '11.0',
  user_dim_app_info_app_id: 'jp.co.omron.healthcare.omron-connect.pro',
  user_dim_geo_info_region: 'Tokyo',
  user_dim_geo_info_city: 'Chuo',
  user_dim_app_info_app_instance_id: '4ADB88BB2B6D49CB9AE43624E89861D3' */

        //data_transfering messages that can help uniquely idetifying a device
        //serial_no
        //serial_date
        //device_code
        //device_nickname
        //company_code
        console.log(lineoParsed);
        if (perInfo = this.hasDeviceInfo(lineoParsed)){
            ///*{ device_registration: { device_type: [ 'HJA-403C_Pro', null ] } }
            //group these messages

        }

        //let uha = lineo.user_dim_device_info_platform_version + lineo.user_dim_app_info_app_instance_id + 



    }

    filterFields.prototype.hasDeviceInfo = function(lineoParsed) {

        let pick =['device_type','device_code','device_nickname','company_code','serial_no','serial_date'];
        while (a=pick.pop()){

            if (lineoParsed.hasOwnProperty(a)){
                return lineoParsed;
            }

        }
        
        return false;

        /*{ device_registration: { device_type: [ 'HJA-403C_Pro', null ] } }
2106
{ data_transfering: { device_code: [ 'FE23D9B4-80BB-4FA4-A3C2-8D443FAB85AE', null ] } }
2107
{ data_transfering: { device_nickname: [ 'HJ-326F_Pro', null ] } }
2108
{ data_transfering: { company_code: [ '55555555', null ] } }

event_dim_params_key
      this.eventKeys = ['company_code','branch_code','device_code','status','error_info','device_type','device_nickname'
      ,'serial_no','serial_date','action','value','app_version','def_file_version'];
        //event_dim_params_value_string_value	
        
        */


    }


    filterFields.prototype.analyzeKeys = function (lineo){
            
            let event_dim_name = lineo.event_dim_name;
            //console.log("-"+lineo.event_dim_name);
            
            var ekFound = false;
            var o ={};

            for (f=0;f<this.eventNames.length;f++){
                console.log(this.eventNames[f]);
                if (event_dim_name==this.eventNames[f]) {
                    ekFound=true;
                    if ( eko = this.eventKeyAnalyze(event_dim_name,lineo)) {
                        o[event_dim_name] = eko;

                        if (iuHint=this.deductIndividualUser(eko,lineo)){

                            console.log("had pers info hints");
                        }
                        console.log(o);
                        return;
                    }
                    
                    

                }
            }

            
            //console.log(lineo);
            if (this.ignoredkeys0[event_dim_name] == undefined) {
                this.ignoredkeys0[event_dim_name]=[];
            }
            //ignoredSubkeys1
            this.ignoredkeys0[event_dim_name].push(lineo);

            console.log("-"+lineo);
            console.log(lineo);
            //process.exit();
            //ignored[event_dim_name] = true;
            return false;
        }

    filterFields.prototype.eventKeyAnalyze = function (key,lineo){

        //'device_registration','device_setting','data_transfering','device_statistics','app_setting'

        //this.eventKeys = ['company_code','branch_code','device_code','status','error_info','device_type',
        //'device_nickname','serial_no','serial_data','action','value','app_version','def_file_version'];

        if (o = this.eventParamsKeyAnalyze(lineo)) {
            return o;
            console.log(o);
        }
        return false;

        switch (key) {

            case 'device_registration':

                if (c=this.analyzeEventType_device_registration) {



                }

            case 'device_setting':

            case 'data_transfering':

            case 'device_statistics':

            case 'app_setting':

            default:


        }
    }
    

    filterFields.prototype.eventParamsKeyAnalyze = function(lineo){

        //this.eventKeys = ['company_code','branch_code','device_code','status','error_info','device_type',
        //'device_nickname','serial_no','serial_data','action','value','app_version','def_file_version'];
        var deadKeys = [];
        var o = {};
        var found = false;
        for (f=0;f<this.eventKeys.length;f++){
            //console.log(this.eventKeys[f]+" "+  lineo.event_dim_params_key)
            if (this.eventKeys[f]==lineo.event_dim_params_key) {
                found = true;
                o[this.eventKeys[f]]=[lineo.event_dim_params_value_string_value,lineo.event_dim_params_value_int_value];
                return o;
            }
        }   //

        if (this.ignoredSubkeys1[lineo.event_dim_params_key] == undefined) {
            this.ignoredSubkeys1[lineo.event_dim_params_key]=[];
        }
        //ignoredSubkeys1
        this.ignoredSubkeys1[lineo.event_dim_params_key].push(lineo);

        return false;
        ////event_dim_params_value_string_value	
        //this.status = ['info','warn','error','fatal'];


    }


    filterFields.prototype.analyzeEventType_device_registration = function(o) {

        let oo = this.basicParse


    }

  //let user = new filterFields("John");
  //user.sayHi();
  module.exports = filterFields
