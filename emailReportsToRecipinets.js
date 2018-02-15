//import { create } from 'domain';


const _errorLogger = require('../classes/errorLogger');
var _erlog = new _errorLogger();

//this guy needs the daily/realtime parameter

var repType = "daily";


var args = process.argv.slice(2);
//node processRaport daily/realtime 1-3 (levels)
if (args[0]=="realtime") {
    repType = "realtime"
} 

//this does the thing, on error writes to error log

//console.log(JSON.stringify({success:repType}));


var dateFormat = require('dateformat');
var now = new Date();
//this is for reading the latest files for csv attachments
let da = dateFormat(now, "yyyymmddhh" );

//const filePath = './data/csv/'+rt+'_'+da+'_'+rst+'_report.csv';
  


var fs = require('fs');
const filePath = "./settingsFiles/settings.json";

fs.readFile(filePath, 'utf8', function (err, filedata) {
    
    if (err) {
        _erlog.settingsFileReadFailError(filePath,err);

        console.log(JSON.stringify({error:'settingsFileReadFailError',text:err}))
        process.exit();
        
    }

    var set = JSON.parse(filedata);
    //console.log(set);
    var recipients = [];
    Object.keys(set).forEach(function(key) {
    
        //console.log('key '+key);
        let v = set[key];
        //console.log(v);
        if (v.type == repType){
            recipients.push(v.email);
        }

    });
    
    if (recipients.length == 0){
        
        //no recipents for this type of reports
        _erlog.mailServerEmptyRecipientsError(filePath,err);
        console.log(JSON.stringify({error:'mailServerEmptyRecipientsError',text:set}))
        process.exit();

    }
        let rr = {
            users : recipients
        }
        //console.log(JSON.stringify(rr));

        createMail(repType,recipients,function(success,recipents,attachments){

            console.log(JSON.stringify({ok:success,recipents:recipents,attachments:attachments}));
            process.exit();

        },function(err){
            //something went wrong sending the mail
            let ex = _erlog.mailServerAccessError(err);
            console.log(JSON.stringify({error:ex}));
            process.exit();

        });

    });

    function attachedCSVfilename (repType,level) {

        var now = new Date();
        let da = dateFormat(now, "yyyymmddhh" );

        const filePath = './data/csv/'+repType+'_'+da+'_'+level+'_report.csv';

        return filePath;
    }

    function createMail(repType,recipents,successHandler,errorHandler) {
        //console.log('createMail');
        var attachments = [];
        //get filenames for csvs
        for (f=1;f<4;f++){

            let t = attachedCSVfilename(repType,f);

            //todo: check if filenames exist
            attachments.push(t);

        }
        //recipents.push('sami.vuokila.ho11@pang-cristal.com');
        //console.log(recipents);
        //return;
        //recipients come in an array
        //console.log('* [example 1.1] sending test email');

        var now = new Date();
        let da = dateFormat(now, "yyyymmddhh" );
        let subj = repType + ' analytics '+da;
        // Require'ing module and setting default options

        var send = require('gmail-send')({

            user: 'analyticsreportingomr@gmail.com',
          // user: credentials.user,                  // Your GMail account used to send emails
            pass: '80b7eF7Flime',
            // pass: credentials.pass,                  // Application-specific password
            to:   recipents,
        // to:   credentials.user,                  // Send to yourself
                                           // you also may set array of recipients:
                                           // [ 'user1@gmail.com', 'user2@gmail.com' ]
        // from:    credentials.user             // from: by default equals to user
        // replyTo: credentials.user             // replyTo: by default undefined
        subject: subj,
        text:    '',         // Plain text
        //html:    '<b>html text</b>'            // HTML
        });

        //console.log(send);
        // Override any default option and send email

        //console.log('* [example 1.1] sending test email');
        //var filepath = './demo-attachment.txt';  // File to attach

        send({ // Overriding default parameters
            //subject: 'attached '+filepath,         // Override value set as default
            files: attachments ,
            }, function (err, res) {
                if (err!==null) {
                    return errorHandler(err);
                }
            //console.log('* [example 1.1] send() callback returned: err:', err, '; res:', res);
            return successHandler(res,recipents,attachments);

        });


        return;

var filepath = './demo-attachment.txt';  // File to attach

send({ // Overriding default parameters
  subject: 'attached '+filepath,         // Override value set as default
  files: [ filepath ],
}, function (err, res) {
  console.log('* [example 1.1] send() callback returned: err:', err, '; res:', res);
});



    }