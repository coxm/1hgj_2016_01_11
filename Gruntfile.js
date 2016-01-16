// vim: noet sts=4 ts=4 sw=4
"use strict";
module.exports = function(grunt) {

	[
		'grunt-contrib-cssmin',
		'grunt-contrib-htmlmin',
		'grunt-contrib-uglify',
		'grunt-dom-munger',
		'grunt-ts'
	].forEach(function(packageName) {
		grunt.loadNpmTasks(packageName);
	});

	grunt.initConfig({
		ts: {
			build: {
				src: [
					'refs/common.d.ts',
					'src/util.ts',
					'src/settings.ts',
					'src/State.ts',
					'src/main.ts'
				],
				out: 'app/js/app.js',
				options: {
					target: 'es5',
					sourceMap: false,
					declaration: false,
					comments: true,
					noImplicitAny: true
				}
			}
		},

		dom_munger: {
			dist: {
				options: {
					read: [{
						selector: 'link:not([cdn])',
						attribute: 'href',
						writeto: 'cssNeedsMinifying',
						isPath: true
					}, {
						selector: 'script:not([cdn])',
						attribute: 'src',
						writeto: 'jsNeedsMinifying',
						isPath: true
					}],
					remove: [
						'link:not([cdn])',
						'script:not([cdn])'
					],
					append: [{
						selector: 'head',
						html: '<link href="css/app.min.css" rel="stylesheet">',
					}, {
						selector: 'body',
						html: '<script type="text/javascript" src="js/app.min.js"></script>'
					}],
					callback: function($, file) {
						// Replace src and href attributes with a cdn URL.
						$('[cdn]').each(function useCDN(i, $elem) {
							$elem = $($elem);
							var attrName = $elem.is('link') ? 'href' : 'src';
							$elem.attr(
								attrName, $elem.attr('cdn')
							).removeAttr('cdn');
						});
					}
				},
				src: 'app/index.html',
				dest: 'dist/index.html'
			}
		},

		cssmin: {
			dist: {
				src: '<%= dom_munger.data.cssNeedsMinifying %>',
				dest: 'dist/css/app.min.css'
			}
		},

		uglify: {
			options: {
				mangle: true,
				mangleProps: true,
				compress: true,
				wrap: true
			},
			dist: {
				src: '<%= dom_munger.data.jsNeedsMinifying %>',
				dest: 'dist/js/app.min.js'
			}
		},

		htmlmin: {
			// To be run *after* dom_munger, so we can minify dist/index.html.
			mungedDist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'dist/index.html': 'dist/index.html'
				}
			}
		}
	});

	grunt.registerTask('default', ['ts']);
	grunt.registerTask('dist', [
		'ts',
		'dom_munger',
		'cssmin',
		'uglify',
		'htmlmin'
	]);
}
