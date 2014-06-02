module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: '\n\n/* ---------------------------------------------------------- */\n\n'
            },
            imgCarBuilder: {
                dest: 'build/files/image-carousel-3d-builder.js',
                src: [
                    'src/js/polyfills.js',
                    'src/js/image-carousel-3d-builder.js',
                    'src/js/image-carousel-3d.js'
                ],
                nonull: true
            },
            imgCarJs: {
                dest: 'build/files/image-carousel-3d.js',
                src: [
                    'src/js/polyfills.js',                    
                    'src/js/image-carousel-3d.js'
                ],
                nonull: true
            }
        },


        uglify: {            
            imgCarJs: {

                options: {
                    banner: '/*\n* Image Carousel 3D \n* Date: <%= grunt.template.today("dd-mm-yyyy") %> \n*\n* ...\n* @author harry \n*/\n',
                    sourceMappingURL: 'image-carousel-3d.map',
                    sourceMap: 'build/files/image-carousel-3d.map',
                    sourceMapPrefix: 2
                },

                files: {
                    'build/files/image-carousel-3d-min.js': ['build/files/image-carousel-3d.js']
                }


            },
            imgCarBuilder: {

                options: {
                    banner: '/*\n* Image Carousel 3D Builder \n* Date: <%= grunt.template.today("dd-mm-yyyy") %> \n*\n* ...\n* @author harry \n*/\n',
                    sourceMappingURL: 'image-carousel-3d-builder.map',
                    sourceMap: 'build/files/image-carousel-3d-builder.map',
                    sourceMapPrefix: 2
                },

                files: {
                    'build/files/image-carousel-3d-builder-min.js': ['build/files/image-carousel-3d-builder.js']
                }

            }

        },

        jshint: {

            files: ['Gruntfile.js', 'src/js/img-carousel-3d-builder.js', 'src/js/img-carousel-3d.js'],
            options: {
                expr: true
            }
        },

        less: {
            development: {
                options: {
                    paths: ["assets/css"]
                },
                files: {
                    "src/css/image-carousel-3d.css": "src/css/image-carousel-3d.less"
                }
            },
            production: {
                options: {
                    paths: ["assets/css"],
                    cleancss: true,
                    modifyVars: {
                        imgPath: ''
                    }
                },
                files: {
                    "build/files/image-carousel-3d.css": "src/css/image-carousel-3d.less"
                }
            }
        },

        watch: {
            files: ['src/**/*.*', 'sandbox/index.html'],
            tasks: ['less:development'],
            options: {
                livereload: true
            }
        },

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


    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'less:production', 'build-dist']);


    grunt.registerTask('dev', ['connect', 'watch']);

    grunt.registerTask('build-dist', 'Building distribution', function() {

        //build dist                    
        /*grunt.file.copy('build/files/image-carousel-3d.css', 'dist/image-carousel-3d.css');
        // grunt.file.copy('build/demo-files/index.html', 'dist/index.html');

        //copy dynmaic files to dist
        grunt.file.copy('build/files/image-carousel-3d-min.js', 'dist/image-carousel-3d-min.js');
        grunt.file.copy('build/files/image-carousel-3d.map', 'dist/image-carousel-3d.map');
        grunt.file.copy('build/files/image-carousel-3d-all.js', 'dist/image-carousel-3d-all.js');
        grunt.file.copy('build/data/image-carsouel-3d-data.json', 'dist/data/image-carsouel-3d-data.json');
*/
    });

};