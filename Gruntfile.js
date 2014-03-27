module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // tasks
        compass: {
            dev: {
                options: {
                    config: 'compass.conf.rb'
                }
            }
        },
        watch: {
            sass: {
                files: './static/sass/**/*.scss',
                tasks: ['compass:dev']
            },
            source: {
                files: ['static/**', 'templates/**', 'forms.py'],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
