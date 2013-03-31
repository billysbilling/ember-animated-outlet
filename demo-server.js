var fs = require('fs'),
    express = require('express');

var app = express();

app.use('/dist', express.static(__dirname + '/dist'));
app.use('/demo', express.static(__dirname + '/demo'));
app.use('/vendor', express.static(__dirname + '/vendor'));

app.use(function(req, res, callback){
    fs.readFile(__dirname + '/demo/index.html', 'utf8', function(err, html){
        if (err) return callback(err);
        res.send(html);
    });
});

app.listen(3000);