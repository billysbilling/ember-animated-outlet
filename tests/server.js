var fs = require('fs'),
    childProcess = require('child_process'),
    express = require('express');

var app = express();

app.use('/dist', express.static(__dirname + '/../dist'));
app.use('/tests', express.static(__dirname + '/../tests'));
app.use('/vendor', express.static(__dirname + '/../vendor'));

app.get('/', function(req, res, callback) {
    childProcess.exec('grunt', function(err, output) {
        if (err) {
            console.log('Grunt error:');
            console.log(output);
            return callback(err);
        }
        fs.readFile(__dirname + '/index.html', 'utf8', function(err, html){
            if (err) return callback(err);
            res.send(html);
        });
    });
});

app.listen(7846);