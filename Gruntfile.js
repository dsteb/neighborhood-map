module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
    wiredep: {
      task: {
        src: 'app/**/*.html'
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          keepalive: true,
          open: true,
        }
      },
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/bootstrap/dist/',
            src: 'fonts/**/*',
            dest: 'dist/',
          }, {
            expand: true,
            cwd: 'app/',
            src: '**/*.json',
            dest: 'dist/',
          }
        ],
      },
    },
    concat: {
      vendor: {
        src: [
            'bower_components/jquery/dist/jquery.min.js', 
            'bower_components/knockout/dist/knockout.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js'
        ],
        dest: 'build/vendor.min.js',
      },
      vendorcss: {
        src: [
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
        ],
        dest: 'build/vendor.min.css',
      },
      dist: {
        src: ['build/vendor.min.js', 'build/main.min.js'],
        dest: 'dist/js/scripts.min.js',
      },
      distcss: {
        src: ['build/vendor.min.css', 'build/main.min.css'],
        dest: 'dist/css/styles.min.css',
      },
    },
    uglify: {
      dist: {
        files: {
          'build/main.min.js': 'app/js/main.js',
        }
      }
    },
    cssmin: {
      target: {
        files: {
          'build/main.min.css': 'app/css/main.css',
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
        },
        files: {
          'dist/index.html': 'build/index.html',
        }
      }
    },
    targethtml: {
      dist: {
        files: {
          'build/index.html': 'app/index.html',
        }
      }
    },
    clean: ['build/', 'dist/'],
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-targethtml');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');


  grunt.registerTask('default', ['jshint', 'wiredep', 'connect']);
  grunt.registerTask('prod', ['clean', 'jshint', 'targethtml', 'concat:vendor', 
    'concat:vendorcss', 'uglify', 'cssmin', 'concat:dist', 'concat:distcss', 
    'copy', 'htmlmin',]);

};