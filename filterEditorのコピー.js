//https://joshuajohnson.co.uk/Choices/
//https://github.com/jshjohnson/Choices

function filterFields() {

    this.scenarios = {};
    this.switches = {};
    this.type = 'daily'; //realtime
    this.timestamp = 0;

    this.scenarios['device_registration']= {

        'company_code' : '',
        'branch_code' : '',
        'device_code' : '',
        'status' : ['info','warn','error','fatal'],
        'error_info' : '',
        'device_type' : '',
        'device_nickname' : '',
        'serial_no' : '',
        'serial_date' : '',
        'action' : ['device_regist'],
        'value' : ''

    }

    this.scenarios['device_setting']= {

        'company_code' : '',
        'branch_code' : '',
        'device_code' : '',
        'status' : ['info','warn','error','fatal'],
        'error_info' : '',
        'device_type' : '',
        'device_nickname' : '',
        'serial_no' : '',
        'serial_date' : '',
        'action' : ['device_set','datetime_update','device_delete','device_change_name'],
        'value' : ''

    }

    this.scenarios['data_transfering']= {

        'company_code' : '',
        'branch_code' : '',
        'device_code' : '',
        'status' : ['info','warn','error','fatal'],
        'error_info' : '',
        'device_type' : '',
        'device_nickname' : '',
        'serial_no' : '',
        'serial_date' : '',
        'action' : ['data_transfer','data_cloud_sync'],
        'value' : ''

    }

    this.scenarios['device_statistics']= {

        'company_code' :  '',
        'branch_code' : '',
        'device_code' : '',
        'status' : ['warn'],
        'error_info' : '',
        'device_type' : '',
        'device_nickname' : '',
        'serial_no' : '',
        'serial_date' : '',
        'action' : ['serial_data_overflow_detection','checksum_error_detection','timezone_change_detection','time_difference_detection'],
        'value' : ''

    }

    this.scenarios['app_setting'] = {

        'company_code' : '',
        'branch_code' : '',
        'device_code' : '',
        'status' : ['info','warn','error','fatal'],
        'error_info' : '',
        'app_version' : '',
        'def_file_version' : '',
        //serial_no = '',
        //serial_date = '',
        'action' : ['app_update','definition_update'],
        'value' : ''

    }


}

filterFields.prototype.getScenarioTypes = function(){

    var t =[];
    Object.keys(this.scenarios).forEach(function(key) {
        //var val = this.ignoredkeys0[key];
        t.push(key)
      });

      return t;
}

filterFields.prototype.setScenarioParentSwitch = function(cat){

    let cat2= this.switches[cat].onOff;
    if (cat2) {
        this.switches[cat].onOff = false;
    } else {
        this.switches[cat].onOff = true;
    }
    return this.switches[cat].onOff;
}


filterFields.prototype.setScenarioSwitch = function(key,cat){

    let cat2= this.switches[cat];
    let key2= cat2.list[key];

    console.log(key2);

    if (key2.length==1) {

    } else {

        if (key2){
            cat2.list[key] =false;
        } else {
            cat2.list[key]= true;
        }

    }
    
    this.switches[cat].dirty = true;
    return cat2.list[key];
}

filterFields.prototype.getScenarioSwitches = function(){
    
    var me =this;
    var sc = {};

    Object.keys(me.switches).forEach(function(key) {

        var nig = me.switches[key];

        if (typeof nig !== 'object') {
            sc[key]=me.switches[key];
        } else {
            var zil =nig.onOff;

            if (nig.onOff==true){
                sc[key]=me.switches[key];
            }
           
        }
        
    });

    
    sc.type = this.type;
    sc.timestamp = 123;
    return sc;

}


filterFields.prototype.injectScenarioSwitches = function(passedSwitches){

    var s = {};
    s.dirty = false;
    var me = this;

    Object.keys(this.scenarios).forEach(function(key) {
        //var val = this.ignoredkeys0[key];
        var pon = false;
        
        if (passedSwitches[key]!==undefined){
            if (passedSwitches[key].onOff){
                pon=true;
            }
        }
        s[key] = {
            onOff : pon,
            dirty : false,
            list : {}

        }

        Object.keys(me.scenarios[key]).forEach(function(key2) {
            var o = me.scenarios[key][key2];
            var ponpon = false;

            if (passedSwitches[key]!==undefined){
                var oo = passedSwitches[key].list[key2];
                if (passedSwitches[key].list[key2]!==undefined){
                    if (passedSwitches[key].list[key2]!==false){
                        //one more nest?
                        ponpon=true;
                    }
                }

            } else {
                omg =1;
            }
            

            
            if (o.length>1){

                var ob = {};
                for (f=0; f<o.length; f++){
                    var tt = o[f];
                    ob[tt]=ponpon;

                }

                s[key].list[key2]=ob;


            } else {
                var mu=Math.floor(Math.random()*2) + 0;
                var vx = false;
                /*if (mu==0){
                    vx=true;
                }
                s[key].list[key2]=vx;*/
                s[key].list[key2]=ponpon;
            }

        });
        
      });   //all items
      console.log("reinster swui");
      this.switches = s;

      console.log(s);

      return s;

}


filterFields.prototype.primeScenarioSwitches = function(){

    var s = {};
    s.dirty = false;
    var me = this;

    Object.keys(this.scenarios).forEach(function(key) {
        //var val = this.ignoredkeys0[key];
        s[key] = {
            onOff : true,
            dirty : false,
            list : {}

        }

        Object.keys(me.scenarios[key]).forEach(function(key2) {
            var o = me.scenarios[key][key2];
            if (o.length>1){

                var ob = {};
                for (f=0; f<o.length; f++){
                    var tt = o[f];
                    ob[tt]=false;

                }

                s[key].list[key2]=ob;


            } else {
                var mu=Math.floor(Math.random()*2) + 0;
                var vx = false;
                /*if (mu==0){
                    vx=true;
                }*/
                s[key].list[key2]=vx;

            }

        });
        
      });   //all items

      this.switches = s;

      console.log(s);

      return s;

}

/*

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
        
*/
