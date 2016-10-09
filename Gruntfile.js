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
            src: ['**/*.min.css', '**/*.min.js', 'fonts/**/*'],
            dest: 'dist/',
          }, {
            expand: true,
            cwd: 'bower_components/jquery/dist/',
            src: 'jquery.min.js',
            dest: 'dist/js/',
          }, {
            expand: true,
            cwd: 'bower_components/knockout/dist',
            src: 'knockout.js',
            dest: 'dist/js/',
          }, {
            expand: true,
            cwd: 'app/',
            src: ['**/*.css', '**/*.js', '**/*.json'],
            dest: 'dist/',
          }
        ],
      },
    },
    concat: {

      dist: {
        src: ['app/js/main.js', 'app/js/model.json'],
        dest: 'dist/yomen.js'
      }
    },
    uglify: {
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/yomen.min.js'
      }
    },
    targethtml: {
      dist: {
        files: {
          'dist/index.html': 'app/index.html',
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-targethtml');


  grunt.registerTask('default', ['jshint', 'wiredep', 'connect']);
  grunt.registerTask('prod', ['jshint', 'copy:dist', 'targethtml:dist']);

};