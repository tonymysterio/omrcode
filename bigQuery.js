const _errorLogger = require('../classes/errorLogger');
var _erlog = new _errorLogger();

const _pastDailyMockAdaptor = require('../classes/pastDailyMock');
const _pdm = new _pastDailyMockAdaptor();


// Instantiates a client
const BigQuery = require('@google-cloud/bigquery');

const bigquery = BigQuery({projectId:'omron-connect-for-development'});

// Query options list: https://cloud.google.com/bigquery/docs/reference/v2/jobs/query

function _bigQuery(){
}

_bigQuery.prototype.pull = function(sqlQuery,successHandler,errorHandler){

    const options = {
    query: sqlQuery,
    useLegacySql: true // Use standard SQL syntax for queries.
    };

    // Runs the query
    bigquery
    .query(options)
    .then((results) => {
        const rows = results[0];
        successHandler(rows);
        //console.log(rows);
    })
    .catch((err) => {
        return errorHandler(err);
        //console.error('ERROR:', err);
    });   

}

_bigQuery.prototype.pullFAKE = function(sqlQuery,successHandler,errorHandler){

    //console.log(sqlQuery);
    //just load from disk and pretend its from DB
    _pdm.prime([],function(lines){
        //console.log('pullfale');
        //just pulls some data on disk and returns it
        return successHandler(lines);

    })

}


module.exports = _bigQuery