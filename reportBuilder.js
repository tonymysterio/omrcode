//with provided data, create level 1 2 3 reports

var _grouper = require ("../ui/uiJS/grouper.js");


_reportBuilder = function(){

    this.grouper = new _grouper();

}

_reportBuilder.prototype.level3 = function(data){

    //all device errors except notifications
    //http://localhost:8081/deviceAllExceptNotifications.html

    //console.log('reportBuilder.prototype.level3');

    let groupByInstanceID = this.grouper.groupBy_user_dim_app_info_app_instance_id(data);
    let pgs = this.grouper.processGroups(groupByInstanceID); //returns populated groups, omit info

    let groupsWithStatuses = this.grouper.filterNonStatusesFromGroups(pgs[1],{info:false});
    //let pgs = grouper.processGroups(dataWithStatuses); //returns populated groups, omit info
    let lev3 = this.grouper.prepareForLevel3Report(groupsWithStatuses);
    
    return lev3;



}

_reportBuilder.prototype.level2 = function(data){

    //deviceErrors

    //console.log('reportBuilder.prototype.level2');
    //console.log('dalen '+data.length);
    let groupByInstanceID = this.grouper.groupBy_user_dim_app_info_app_instance_id(data);
    let pgs = this.grouper.processGroups(groupByInstanceID); //returns populated groups
    
    //let fnaa = grouper.EventsErrorsEtcAcrossPopulatedGroups(pgs[1]);
    let fi = this.grouper.filterForDeviceErrors(pgs[1]);
    //console.log('dalen back '+fi.length);
    return fi;

    
}

_reportBuilder.prototype.level1 = function(data){
    //total errors

    let groupByInstanceID = this.grouper.groupBy_user_dim_app_info_app_instance_id(data);
    let pgs = this.grouper.processGroups(groupByInstanceID); //returns populated groups
    
    let fnaa = this.grouper.EventsErrorsEtcAcrossPopulatedGroups(pgs[1]);
    let fi = this.grouper.filterForTotalErrors(fnaa);
    return fi;

    
}


module.exports = _reportBuilder