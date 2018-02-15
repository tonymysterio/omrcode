
function _grouper() {

    this.groupedList = [];
    this.allStatuses = [];
    this.usersWithStatuses = [];
    this.groupIDs = [];
}


_grouper.prototype.groupBy_user_dim_app_info_app_instance_id = function(list){

    var groups = {};
    for (f=0;f<list.length;f++){

        let item = list[f];
        let instid = item.user_dim_app_info_app_instance_id;

        if (groups[item.user_dim_app_info_app_instance_id]==undefined){
            groups[item.user_dim_app_info_app_instance_id] = [];
        }

        groups[item.user_dim_app_info_app_instance_id].push(item);

    }

    return groups;
}

_grouper.prototype.filterNonStatuses = function(data,excludeObject){

    var list = [];

    return this.lookForStatusInGroup(data,excludeObject);

}
_grouper.prototype.filterNonStatusesFromGroups = function(data,excludeObject){

    var list = [];

    for (f=0;f<data.length;f++){

        let item = data[f];
        if (b = this.lookForStatusInGroup(item,excludeObject)){
            list.push(b);
        }

    }

    return list;
}

_grouper.prototype.lookForStatusInGroups = function (groups,excludeObject){

    var me=this;
    var ob = {};

    Object.keys(groups).forEach(function(key) {

        let grp = groups[key];
        if ( b = me.lookForStatusInGroup(grp)) {

            ob[key]=b;
        }
        
    });

    return ob;

}

_grouper.prototype.lookForStatusInGroup = function (group,excludeObject){

    var list =[];
    var preStat = false;

    //filters out stuff with no status specified

    for (f=0;f<group.length;f++){

        let item = group[f];
        //console.log(item.event_dim_params_key);
        if (item.event_dim_params_key == 'status'){

            let stype = item.event_dim_params_value_string_value;
            if (excludeObject!==undefined){

                //want to skip a particular status type like info, pass it here
                if (excludeObject[stype]!==undefined){
                    continue;
                }

            }
            item.status = stype;
            list.push(item);
        }
    }

    if (list.length===0) { return false; }
    return list;

}


_grouper.prototype.processGroups = function (groups) {

    var list = [];
    var allStatuses = [] ;   //links to users with statuses
    var usersWithStatuses = [];
    var me = this;
    let processedGroups = [];

    Object.keys(groups).forEach(function(key) {

        let grp = groups[key];
        let grpPop = me.populateGroupWithDeviceCodeCompanyCode(grp);
        let groupID = grp[0].user_dim_app_info_app_instance_id;
        
        let items = grpPop[0];
        let statuss = grpPop[1];

        processedGroups.push(items);

        a=0;
        var statusIndex = list.length - 1;

        while (b=items[a]){
            list.push(b);

            a++;
        }
        
        if (Object.keys(statuss).length) {
            //insert links to user specific statuses with an index
            let userStatuses = {};
            Object.keys(statuss).forEach(function(key2) {
                let sta = statuss[key2];
                //contains an array
                while (ax=sta.pop()){
                    let narf= a+statusIndex;
                    allStatuses.push(narf);
                }


            });

            
            usersWithStatuses.push(groupID);

            //statuses.push([groupID,userStatuses]);

        }

    });

    this.groupedList = list;
    this.allStatuses = allStatuses;
    this.usersWithStatuses = usersWithStatuses;

    //console.log(usersWithStatuses);
    return [list,processedGroups];
}

_grouper.prototype.populateGroupWithDeviceCodeCompanyCode = function(group){

    var list = [];

    var company_code = '';
    var branch_code = '';
    var device_code = '';
    var device_nickname = '';
    var device_type = "";
    var serial_no = '';
    var serial_date = "";
    var error_count = 0;
    var warning_count = 0;
    var info_count =0;
    var fatal_count = 0;
    var app_version = '';
    var def_file_version = '';
    var statuses = {};
    var statusesByEvent = {};

    for (f=0;f<group.length;f++){

        let item = group[f];
        let ev = item.event_dim_name;

        if (item.event_dim_params_key == 'app_version') {
            app_version = item.event_dim_params_value_string_value;
        }

        if (item.event_dim_params_key == 'def_file_version') {
            def_file_version = item.event_dim_params_value_string_value;
        }

        if (item.event_dim_params_key == 'device_code') {
            device_code = item.event_dim_params_value_string_value;
        }
        
        if (item.event_dim_params_key == 'serial_no') {
            serial_no = item.event_dim_params_value_string_value;
        }
        if (item.event_dim_params_key == 'serial_date') {
            serial_date = item.event_dim_params_value_string_value;
        }

        if (item.event_dim_params_key == 'device_type') {
            device_type = item.event_dim_params_value_string_value;
        }

        if (item.event_dim_params_key == 'device_nickname') {
            device_nickname = item.event_dim_params_value_string_value;
        }

        if (item.event_dim_params_key == 'company_code') {
            company_code = item.event_dim_params_value_string_value;
        }
        
        if (item.event_dim_params_key == 'status') {

            let st = item.event_dim_params_value_string_value;
            if (st=='error'){
                error_count++;
            }
            if(st=='warn'){
                warning_count++;
            }
            if(st=='info'){
                info_count++;
            }
            if(st=='fatal'){
                fatal_count++;
            }

            if (statuses[st]===undefined){
                statuses[st] = [];
            } 
            statuses[st].push(f);   //link to the status
            
            if (statusesByEvent[ev]==undefined){

                statusesByEvent[ev]={};

            }

            if (statusesByEvent[ev][st]==undefined) {

                statusesByEvent[ev][st]=[];

            }

            statusesByEvent[ev][st].push(f);            

        }


    }   //loop all

    //inject with data
    for (f=0;f<group.length;f++){

        let item = group[f];
        let ev = item.event_dim_name;

        group[f].company_code = company_code;
        group[f].branch_code = branch_code;
        group[f].device_code = device_code;
        group[f].device_nickname = device_nickname;
        group[f].device_type = device_type;
        group[f].serial_date =  serial_date;
        group[f].serial_no = serial_no;
        group[f].app_version = app_version;
        group[f].def_file_version = def_file_version;
        
        group[f].error_count = error_count;
        group[f].warn_count = warning_count;
        group[f].info_count = info_count;
        group[f].fatal_count = fatal_count;
       
        group[f].event_error_total =0;
        group[f].event_warn_total =0;
        group[f].event_info_total =0;
        group[f].event_fatal_total =0;

        if (statusesByEvent[ev]!==undefined){
            if (statusesByEvent[ev]['info']!==undefined) {
                group[f].event_info_total = statusesByEvent[ev]['info'].length;
            }
            if (statusesByEvent[ev]['warn']!==undefined) {
                group[f].event_warn_total = statusesByEvent[ev]['warn'].length;
            }
            if (statusesByEvent[ev]['error']!==undefined) {
                group[f].event_error_total = statusesByEvent[ev]['error'].length;
            }
            if (statusesByEvent[ev]['fatal']!==undefined) {
                group[f].event_fatal_total = statusesByEvent[ev]['fatal'].length;
            }

        }

    }
    //console.log(group);

    return [group,statuses,statusesByEvent];
    

}
_grouper.prototype.statsByStatusTypes = function(processedGroups){

    //loop all groups to 

}

_grouper.prototype.populatedGroupEventsErrorsEtc = function(popGroup,omitThis){

    var evtypes = {};
    for(f=0;f<popGroup.length; f++ ) {
        let item = popGroup[f];
        //v
        //event_dim_params_key: "status", event_dim_params_value_string_value: "info"
        
        //dont bother with stuff that has no errors
        if (item.error_count || item.warn_count || item.info_count || item.fatal_count ) {
            if (evtypes[item.event_dim_name]==undefined){
                evtypes[item.event_dim_name] = [];
            }
            evtypes[item.event_dim_name].push(item);
        }

    }
    
    //console.log(evtypes);
    //console.log("mum");
    return evtypes;

}

_grouper.prototype.EventsErrorsEtcAcrossPopulatedGroups = function (popGroups,omitThis){

    var evtypesAcross = {};
    var me=this;

    for (f=0; f< popGroups.length; f++) {

        let popGrp = popGroups[f];
        let evtypes = me.populatedGroupEventsErrorsEtc(popGrp,omitThis);
        Object.keys(evtypes).forEach(function(key) {
        
            let evtype = evtypes[key];
            if (evtypesAcross[key]===undefined){
                evtypesAcross[key]=[];
            }

            evtypesAcross[key].push(evtype);
        }
        
        
        )};

    if (Object.keys(evtypesAcross).length) {
        return evtypesAcross;
    }

    return false;
}

_grouper.prototype.filterForTotalErrors = function (evtypesAcross){

    var lines = [];
    Object.keys(evtypesAcross).forEach(function(key) {

        let evType = evtypesAcross[key];
        let evTypeItem = evType[0][0];
        let line = {};
        line.event_dim_name = evTypeItem.event_dim_name;
        line.event_error_total = evTypeItem.event_error_total;
        line.event_fatal_total = evTypeItem.event_fatal_total;
        line.event_info_total = evTypeItem.event_info_total;
        line.event_warn_total = evTypeItem.event_warn_total;
        lines.push(line);
    });

    return lines;
}

_grouper.prototype.deviceAllExceptNotifications = function (eventGroups) {

    console.log('deviceAllExceptNotifications');
    //process.exit();

    //show everything except notification
    var list = [];
    var users = {};

    Object.keys(eventGroups).forEach(function(key) {

        let evgroupParent = eventGroups[key];
        


        Object.keys(evgroupParent).forEach(function(key2) {

            let evgroup = evgroupParent[key2];
            //prefilter anything that has no or just notfication info

            for(ff=0;ff<evgroup.length; ff++ ) {
                let ev = evgroup[ff];

                
                if ( (ev.event_error_total == 0) && (ev.event_fatal_total==0) && ( ev.event_warn_total == 0) &&  ( ev.event_info_total ==0 )) {
                    continue;
                }
            

                if ( (ev.event_error_total == 0) && (ev.event_fatal_total==0) && ( ev.event_warn_total == 0) &&  ( ev.event_info_total >0 )
            
            ) {
                //nothing but info, skip
                continue;
            }
            //console.log(ev.event_error_total +' '+ev.event_fatal_total+' '+ev.event_warn_total+' '+ev.event_info_total);
                
            var item = ev;
            //if (item==undefined) { continue; }
            let uid = item.device_code;
            let event_dim_name = item.event_dim_name;

            /*if (users[uid]==undefined) {
                users[uid]={};
            }

            if (users[uid][event_dim_name]!==undefined) {
                continue;
            }*/

            //users[uid][event_dim_name] = item;
            if (item.status !== undefined){
                let tit =1;
            }
            if (item.event_dim_params_key == 'status') {

                //console.log(line.event_dim_params_key);
            }

            var line = {};
            line.company_code = item.company_code;
            line.branch_code = item.branch_code;
            line.device_code = item.device_code;
            line.event_dim_name = item.event_dim_name;
            line.status = item.status;
            line.error_info = item.error_info;
            line.device_type = item.device_type;
            line.device_nickname = item.device_nickname;
            line.serial_no = item.serial_no;
            line.serial_date = item.serial_date;
            line.app_version = item.app_version;
            line.def_file_version = item.def_file_version;
            line.action = item.action;
            line.value = item.value;
            

            list.push(line);
            //dont bother with stuff that has no errors
            /*if (item.error_count || item.warn_count || item.info_count || item.fatal_count ) {



            }*/

            }

        });

    });  //looop

    return list;

}

_grouper.prototype.filterForDeviceErrors = function (popGroups){

    //console.log('_grouper.prototype.filterForDeviceErrors');

    var list = [];
    var users = {};

    for(f=0;f<popGroups.length; f++ ) {
        
        let group = popGroups[f];

        

        for(ff=0;ff<group.length; ff++ ) {
            let item = group[ff];
            //if (item==undefined) { continue; }
            let uid = item.device_code;
            let event_dim_name = item.event_dim_name;

            if (users[uid]==undefined) {
                users[uid]={};
            }

            if (users[uid][event_dim_name]!==undefined) {
                continue;
            }

            users[uid][event_dim_name] = item;

            var line = {};
            line.company_code = item.company_code;
            line.branch_code = item.branch_code;
            line.device_code = item.device_code;
            line.event_dim_name = item.event_dim_name;
            line.fatal_count = item.fatal_count;
            line.error_count = item.error_count;
            line.warn_count = item.warn_count;
            line.info_count = item.info_count;

            list.push(line);
            //dont bother with stuff that has no errors
            /*if (item.error_count || item.warn_count || item.info_count || item.fatal_count ) {



            }*/

        }

    }   //looop

    return list;
}

_grouper.prototype.prepareForLevel3Report = function (data){

    var list = [];
    for (f=0;f<data.length;f++){
        var group = data[f];
        for (ff=0;ff<group.length;ff++){

            let i = group[ff];
            let item = {};
            item.company_code = i.company_code;
            item.branch_code = i.branch_code;
            item.device_code = i.device_code;
            item.event_dim_name = i.event_dim_name;
            item.status = i.status;
            item.error_info = i.error_info;
            item.device_type = i.device_type;
            item.device_nickname = i.device_nickname;
            item.serial_no = i.serial_no;
            item.serial_date = i.serial_date;
            item.app_version = i.app_version;
            item.def_file_version = i.def_file_version;
            item.action = i.action;
            item.value = i.value;
            list.push(item);
        }



    }

    return list;
}

module.exports = _grouper