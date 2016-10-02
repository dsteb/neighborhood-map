
(function() {
	'use strict';

	module.exports = function(grunt) {

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
	    serve: {
	    	options: {
	    		port: 8000,
	    	}
	    },
	  });

	  grunt.loadNpmTasks('grunt-contrib-jshint');
	  grunt.loadNpmTasks('grunt-contrib-watch');
	  grunt.loadNpmTasks('grunt-wiredep');
	  grunt.loadNpmTasks('grunt-serve');

	  grunt.registerTask('default', ['jshint', 'wiredep', 'serve']);

	};
})();