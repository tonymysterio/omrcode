//https://joshuajohnson.co.uk/Choices/
//https://github.com/jshjohnson/Choices

function filterFields() {

    this.scenarios = {};
    this.scenarios['device_registration']= {

        company_code = '',
        branch_code = '',
        device_code = '',
        status = ['info','warn','error','fatal'],
        error_info = '',
        device_type = '',
        device_nickname = '',
        serial_no = '',
        serial_date = '',
        action =['device_regist'],
        value = ''

    }

    this.scenarios['device_setting']= {

        company_code = '',
        branch_code = '',
        device_code = '',
        status = ['info','warn','error','fatal'],
        error_info = '',
        device_type = '',
        device_nickname = '',
        serial_no = '',
        serial_date = '',
        action =['device_set','datetime_update','device_delete','device_change_name'],
        value = ''

    }

    this.scenarios['data_transfering']= {

        company_code = '',
        branch_code = '',
        device_code = '',
        status = ['info','warn','error','fatal'],
        error_info = '',
        device_type = '',
        device_nickname = '',
        serial_no = '',
        serial_date = '',
        action =['data_transfer','data_cloud_sync'],
        value = ''

    }

    this.scenarios['device_statistics']= {

        company_code = '',
        branch_code = '',
        device_code = '',
        status = ['warn'],
        error_info = '',
        device_type = '',
        device_nickname = '',
        serial_no = '',
        serial_date = '',
        action =['serial_data_overflow_detection','checksum_error_detection','timezone_change_detection','time_difference_detection'],
        value = ''

    }

    this.scenarios['app_setting']= {

        company_code = '',
        branch_code = '',
        device_code = '',
        status = ['info','warn','error','fatal'],
        error_info = '',
        app_version = '',
        def_file_version = '',
        //serial_no = '',
        //serial_date = '',
        action =['app_update','definition_update'],
        value = ''

    }


}

filterFields.prototype.getScenarioTypes = function(){

    var t =[];
    Object.keys(this.scenarios).forEach(function(key) {
        //var val = this.ignoredkeys0[key];
        t.push(key)
      });

      return key;
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
