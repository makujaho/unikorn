
/**
 * Module dependencies.
 */

var express = require('express'),
    routes  = require('./routes'),
    fs      = require('fs');

// if on node 0.6, this is necessary for compat
fs.exists     = fs.exists     || require('path').exists;
fs.existsSync = fs.existsSync || require('path').existsSync;

var app = module.exports = express.createServer();

var configFile = __dirname + '/config.json';

// Now less files with @import 'whatever.less' will work
// (https://github.com/senchalabs/connect/pull/174
var TWITTER_BOOTSTRAP_PATH = './vendor/twitter/bootstrap/less';
express.compiler.compilers.less.compile = function(str, fn){
    try {
        var less = require('less'),
            parser = new less.Parser({paths: [TWITTER_BOOTSTRAP_PATH]});

        parser.parse(str, function(err, root){fn(err, root.toCSS());});
    } catch (err) {
        fn(err);
        console.log(err);
    }
}

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.compiler({ src : __dirname + '/public', enable: ['less']}));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    //app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
    console.log(
        "Express server listening on port %d in %s mode",
        app.address().port,
        app.settings.env
    );

    fs.exists(configFile, function(e) {
        if(e === true) {
            console.log(configFile + ' exists');
        } else {
            console.log(configFile + ' does not exist');
            var newConfig = {
                twitter: {
                    access_token_key: '',
                    access_token_secret: ''
                }
            };

            fs.writeFile(configFile, JSON.stringify(newConfig), function(err){
                if(err) {
                    console.log("Could not write new config file");
                } else {
                    console.log("Saved new config file");
                }
            });
        }
    });
});
