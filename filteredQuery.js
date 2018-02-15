const fs = require('fs');

let rawdata = fs.readFileSync('filter.json');  

let filter = JSON.parse(rawdata);  

//for query tests
let rawdata2 = fs.readFileSync('mockData.json');  
let mockData = JSON.parse(rawdata2);  
var mockAdaptor = require ("./mockJsonQuery.js");
var _mda = new mockAdaptor(mockData);


console.log(filter);

var filterAdaptor = require ("./ui/uiJS/filterAdapter.js");

var _fap = new filterAdaptor();

/*
if (lookArray = _fap.convertToLookForArray(filter)){
    console.log("SSS");
    
    const rep = _mda.queryMockDataWithQueryArray(lookArray );

    console.log(rep);
    return;
    const queryArray = _fap.simplifyQueryArray(lookArray);

    _fap.queryMockDataWithQueryArray(_mockData,queryArray)
    console.log(lookArray);

} 
*/

function filteredQuery(data) {
    this.data = data;
}

filteredQuery.prototype.queryWithSavedFilter = function(){
    
    let rawdata = fs.readFileSync('filter.json');  
    let filter = JSON.parse(rawdata);  

    if (lookArray = _fap.convertToLookForArray(filter)){
        console.log("zl");
        const rep = _mda.queryMockDataWithQueryArray(lookArray );
        const o = { filter: filter , list : rep }
        //console.log(o);
        
        return o;
    
    }

}

module.exports = filteredQuery;
