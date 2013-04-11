var fs = require('fs');

module.exports = function(grunt) {

    grunt.initConfig({
        meta: {
            name: 'Ember Animated Outlet'
        },
        concat: {
            dist: {
                separator: '\n\n',
                src: [
                    'src/js/animated-container-view.js',
                    'src/js/animated-outlet-helper.js',
                    'src/js/route.js',
                    'src/js/controller-mixin.js',
                    'src/js/effects/*.js'
                ],
                dest: 'dist/ember-animated-outlet.js'
            }
        },
        uglify: {
            dist: {
                src: ['dist/ember-animated-outlet.js'],
                dest: 'dist/ember-animated-outlet.min.js'
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'src/sass',
                    cssDir: 'dist',
                    environment: 'production'
                }
            }
        },
        watch: {
            files: [
                'src/**/*',
                'vendor/**/*'
            ],
            tasks: ['default']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('demo', 'Copy to demo', function() {
        var done = this.async();
        // Run some sync stuff.
        grunt.log.writeln('Copying to demo...');
        var a = 0;
        copyFile('dist/ember-animated-outlet.js', 'demo/public/js/vendor/ember-animated-outlet.js', function(err) {
            if (err) throw err;
            a++;
            if (a == 2) {
                done();
            }
        });
        copyFile('dist/ember-animated-outlet.css', 'demo/public/js/vendor/ember-animated-outlet.css', function(err) {
            if (err) throw err;
            a++;
            if (a == 2) {
                done();
            }
        });
    });
    
    grunt.registerTask('default', ['concat', 'uglify', 'compass', 'demo']);

};

function copyFile(source, target, callback) {
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", function(err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
        done(err);
    });
    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            callback(err);
            cbCalled = true;
        }
    }
}