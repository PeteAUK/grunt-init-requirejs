/*
 * grunt-init-requirejs
 * https://gruntjs.com/
 *
 * Copyright (c) 2013 "Webmunki Pete", Pete Allison
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Create a RequireJS based project';

// Template-specific notes to be displayed before question prompts.
exports.notes = '';

// Template-specific notes to be displayed after question prompts.
exports.after = 'You may now use the _grunt_ commands as found at :\n\n' +
	'https://github.com/PeteAUK/grunt-init-requirejs';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

	init.process({}, [
	// Prompt for these values.
		init.prompt('name'),
		init.prompt('description'),
		init.prompt('version'),
		init.prompt('repository'),
		init.prompt('homepage'),
		init.prompt('bugs'),
		init.prompt('licenses'),
		init.prompt('author_name'),
		init.prompt('author_email'),
		init.prompt('author_url'),
		init.prompt('node_version'),
		init.prompt('main','app/main.js'),
		init.prompt('npm_test', 'grunt nodeunit'),
		{
			name: 'local_port',
			message: 'Local port to use for serving?',
			default: '9999',
			validator: /^\d+$/,
			warning: 'Must be only numbers'
		},
		{
			name: 'npm_install',
			message: 'Automatically install npm modules?',
			default: 'Y/n'
		}
	  ], function(err, props) {
		props.keywords = [];
		props.devDependencies = {
		  'grunt-contrib-concat': '~0.3.0',
		  'grunt-contrib-uglify': '~0.2.0',
		  'grunt-contrib-jshint': '~0.6.0',
		  'grunt-contrib-nodeunit': '~0.2.0',
		  'grunt-contrib-watch': '~0.4.0',
		  'grunt-contrib-requirejs': '~0.4.1',
		  'connect': '~2.12.0',
		  'almond': '~0.2.7'
		};

		// Files to copy (and process).
		var files = init.filesToCopy(props),
			libFolder = props.main.split('/')[0];
			
		// Repath the files correctly
		for (var file in files) {
			if (file.indexOf('lib/') > -1) {
				var path = files[file],
					newFile = file.replace('lib/', libFolder + '/');
				files[newFile] = path;
				delete files[file];
			}
		}

		// Add properly-named license files.
		init.addLicenseFiles(files, props.licenses);

		// Actually copy (and process) files.
		init.copyAndProcess(files, props);

		// Generate package.json file.
		init.writePackageJSON('package.json', props, function(pkg) {
			// Ensure the custom values are stored within the package.json file
			pkg.local_port = props.local_port;
			return pkg;
		});
		
		// Install everything using npm install
		if (props.npm_install.toLowerCase() === 'y' || props.npm_install === 'Y/n') {
			grunt.log.writeln('grunt-init will now install all node dependencies (may take a while)...');
			var exec = require('child_process').exec;
			exec('npm install', function(err, stdout, stderr) {
				//console.log(stdout);
				if (err !== null)
					console.log('exec error: ' + err)
				
				done();
			});
		} else {
			// All done!
			done();
		}
	});
};
