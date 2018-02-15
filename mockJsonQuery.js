
const fs = require('fs');

let rawdata = fs.readFileSync('mockData.json');  
let mockData = JSON.parse(rawdata);  
//console.log(student);  

const queryJS ='[[["event_dim_name","data_transfering"],["event_dim_params_key","device_code"]],[["event_dim_name","device_statistics"],["event_dim_params_key","company_code"],["event_dim_params_key","branch_code"],["event_dim_params_key","device_code"],[["info","warn","error","fatal"],"status"],["event_dim_params_key","error_info"],["event_dim_params_key","device_type"],["event_dim_params_key","device_nickname"],["event_dim_params_key","serial_no"]],[["event_dim_name","app_setting"],["event_dim_params_key","company_code"]]]';
const query = JSON.parse(queryJS);

function mockAdaptor(data) {
    this.data = data;
}

mockAdaptor.prototype.prime = function(filter){



}


mockAdaptor.prototype.queryMockDataWithQueryArray = function(filter){

    var me=this;
    var evdims = {};
    console.log('queryMockDataWithQueryArray');
    //console.log(this.data.evNames);
    //process.exit();

    for (f=0;f<filter.length;f++){
        let k1 = filter[f][0];
        let kk1 = k1[1];
        console.log(k1);
        //console.log(kk1);
        //console.log(this.data.evNames[kk1]);
        if (this.data.evNames[kk1]!==undefined) {
            //loop the remainding values
            console.log('sirdalud FOUND '+kk1 +' '+k1);
            //console.log(this.data.evNames[k1]);
            var root = this.data.evNames[kk1];
            while (a = filter[f].pop()){
                
                console.log(typeof a[1]);
                
                console.log(a[1]);
                
                var kk2 =a[1];
                
                //process.exit();
                if (typeof a[1] === 'object'){
                    //more choices
                    kk2 = a[1][0];

                    if (root[kk2]===undefined) {
                        continue;
                    }

                    console.log('dad '+kk2);
                    console.log(root[kk2]);
                    //loop all a[1][0] 's
                    console.log(a[1][1]);
                    var allterna = [];
                    //while (aa=a[1][1].pop()) {
                    console.log(a[1][1].length);
                    console.log(a[1][1]);

                    for (fc=0;fc<a[1][1].length;fc++){
                        var aa = a[1][1][fc];
                        console.log(aa);
                        console.log(root[kk2][aa]);
                        console.log(typeof root[kk2][aa] )
                        
                        if (root[kk2][aa]===undefined) {
                            continue;
                        }
                        
                        //while (aaa=root[kk2][aa].pop()){
                        for (fc2=0;fc2<root[kk2][aa].length;fc2++){
                            var aaa = root[kk2][aa][fc2];

                            console.log(aaa);
                            console.log(typeof aaa )
                            //process.exit();
                            evdims[aaa]=a;//'dild';
                            allterna.push(aaa);
                            //console.log(allterna);
                            //process.exit();
                        }
                        /*console.log(aa);
                        console.log(root[kk2][aa]);
                        process.exit();
                        console.log(root[kk2][aa]);*/

                    }

                    console.log(allterna);
                    continue;
                    
                    process.exit();
                } 

                //console.log('92TRKS')


                if (root[a[1]]!==undefined){

                    
                    //console.log('ZIL')
                    //console.log(a);
                    //process.exit();

                    //console.log(root[a[1]]);
                    Object.keys(root[a[1]]).forEach(function(kec) {
                        
                        const rnod = root[a[1]][kec];
                        console.log(rnod);
                        for (xx=0; xx< rnod.length; xx++){
                            const mui = rnod[xx];
                            evdims[mui]=a;
                            
                        }
                        
                    })
                    
                    
                    
                } else {

                    console.log(a[1] +' not found');

                }
            }


        } else {

            console.log("missing "+kk1)

        }
        //{evNames : ev_names , data : allData};

    }   //all queries all data

    if (evdims.length==0) { return false; }
    var dataz = [];
    console.log('------------');
    console.log(evdims);
    //process.exit();
    Object.keys(evdims).forEach(function(kec) {

        dataz.push(me.data.data[kec]);

    })
    
    return dataz;

    console.log(dataz.length);
}

/*var _mda = new mockAdaptor(mockData);

_mda.queryMockDataWithQueryArray(query);
*/
//console.log (query);

module.exports = mockAdaptor;