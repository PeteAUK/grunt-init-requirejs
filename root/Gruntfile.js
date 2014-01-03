'use strict';

module.exports = function(grunt) {
	var libFolder = <%= pkg.main.toString().split('/')[0];

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
		  '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
		  '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
		  '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
		  ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		concat: {
		  options: {
			banner: '<%= banner %>',
			stripBanners: true
		  },
		  dist: {
			src: ['<%= pkg.main %>.js'],
			dest: 'dist/<%= pkg.name %>.js'
		  },
		},
		uglify: {
		  options: {
			banner: '<%= banner %>'
		  },
		  dist: {
			src: '<%= concat.dist.dest %>',
			dest: 'dist/<%= pkg.name %>.min.js'
		  },
		},
		nodeunit: {
		  files: ['test/**/*_test.js']
		},
		jshint: {
		  options: {
			jshintrc: '.jshintrc'
		  },
		  gruntfile: {
			src: 'Gruntfile.js'
		  },
		  lib: {
			options: {
			  jshintrc: libFolder + '/.jshintrc'
			},
			src: [libFolder + '/**/*.js']
		  },
		  test: {
			src: ['test/**/*.js']
		  },
		},
		watch: {
		  gruntfile: {
			files: '<%= jshint.gruntfile.src %>',
			tasks: ['jshint:gruntfile']
		  },
		  lib: {
			files: '<%= jshint.lib.src %>',
			tasks: ['jshint:lib', 'nodeunit']
		  },
		  test: {
			files: '<%= jshint.test.src %>',
			tasks: ['jshint:test', 'nodeunit']
		  },
		},
		requirejs: {
			compile: {
				options: {
					almond: true,
					wrap: true,
					insertRequire: ['main'],
					baseUrl: libFolder + '/',
					include: ['main', '../node_modules/almond/almond.js'],
					out: 'dist/main-build.js',
					done: function(done, output) {
						var duplicates = require('rjs-build-analysis').duplicates(output);
						if (duplicates.length > 0) {
							grunt.log.subhead('Duplicates found in requirejs build:');
							grunt.log.warn(duplicates);
							done(new Error('r.js build duplicate modules, please check the excludes option.'));
						}
						done();
					}
				}
			}
		},
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	// Default build task.
	grunt.registerTask('default', ['requirejs', 'uglify']);
	
	// Development web server
	var http = require('http'),
		connect = require('connect'),
		app,
		server,
		port = <%= pkg.local_port %>
	
	grunt.registerTask('dev', 'Starts a development server', function() {
		var done = this.async();
		
		app = connect()
			.use(connect.static(libFolder))
			// Allows /js/lib/require.js to point to the one installed via npm install
			.use('/js/lib/', connect.static('node_modules/grunt-contrib-requirejs/node_modules/requirejs/'));
			
		server = http.createServer(app);
		grunt.log.writeln('Starting static web server on port ' + port);
		
		server
			.listen(port)
			.on('listening', function() {
				grunt.log.writeln('Listening');
			})
			.on('error', function(err) {
				if (err.code === 'EADDRINUSE') {
					grunt.fatal('Port ' + port + ' is already in use');
				} else {
					grunt.fatal(err);
				}
			});
		
		if (true === false) { done(); }
	});
};
