module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // tasks
        compass: {
            naive: {
                options: {
                    config: 'static/naive/compass.rb'
                }
            }
        },
        watch: {
            sass_naive: {
                files: 'static/naive/sass/**/*.scss',
                tasks: ['compass:naive']
            },
            source: {
                files: ['static/naive/**/*.{js,scss,html}',
                        'forms.py'],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
