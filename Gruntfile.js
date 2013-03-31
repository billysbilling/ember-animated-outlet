module.exports = function(grunt) {

    grunt.initConfig({
        meta: {
            name: 'Ember Animated Outlet'
        },
        requirejs: {
            compile: {
                options: {
                    name: 'index',
                    baseUrl: "src/js",
//                    mainConfigFile: "path/to/config.js",
                    out: "dist/ember-animated-outlet.js"
                }
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
                    sassDir: 'src/scss',
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

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['concat', 'uglify', 'compass']);

};