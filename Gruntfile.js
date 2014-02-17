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
                    'src/js/version.js',
                    'src/js/animated-container-view.js',
                    'src/js/animated-outlet-helper.js',
                    'src/js/link-to-animated-helper.js',
                    'src/js/router.js',
                    'src/js/route.js',
                    'src/js/controller-mixin.js',
                    'src/js/effects/*.js'
                ],
                dest: 'dist/ember-animated-outlet.js'
            }
        },
        'string-replace': {
          version: {
            files: {
              'dist/ember-animated-outlet.js': 'dist/ember-animated-outlet.js',
              'dist/ember-animated-outlet.min.js': 'dist/ember-animated-outlet.min.js'
            },
            options: {
              replacements: [{
                pattern: /{{ VERSION }}/g,
                replacement: '<%= pkg.version %>'
              }]
            }
          }
        },
        pkg: grunt.file.readJSON('package.json'),
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
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['concat', 'string-replace', 'uglify', 'compass']);

};