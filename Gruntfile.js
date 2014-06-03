module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
    
        connect: {
            server: {
                options: {
                    port: 8000,
                    hostname: '*',
                    open: {
                        target: 'http://localhost:8000/sandbox/',
                        appName: 'Chrome'
                    }
                }
            }
        }

    });



    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['watch']);


    grunt.registerTask('dev', ['connect', 'watch']);

  

};