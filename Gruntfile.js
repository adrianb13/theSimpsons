'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-build-control');
  var pkg = require('./package.json');

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= mochaTest.test.src %>'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: [
      'test/mock'
      ]
    },

    watch: {
      tests: {
        files: [
          'tasks/**/*', 'test/**/*',
          '!**/test/mock/**',

          // don't watch remote repo files
          // see https://github.com/gruntjs/grunt-contrib-watch/issues/75#issuecomment-70389741
          '!test/scenarios/**/{remote,*_remote}/{**/*,*}'
        ],
        tasks: 'test',
        options: {
          atBegin: true
        }
      }
    },

    // Configuration to be run (and then tested).
    buildcontrol: {
      options: {
        dir: 'dist',
        commit: true,
        push: true,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      pages: {
        options: {
          remote: 'git@github.com:adrianb13/thesSimpsons.git',
          branch: 'gh-pages'
        }
      },
      local: {
        options: {
          remote: '../',
          branch: 'build'
        }
      },
      production: {
        options: {
          branch: 'prod',
          remote: 'git@github.com:robwierzbowski/grunt-build-control.git',
          commit: true,
          message: 'Check *this* out.',
          push: true
        }
      }
    },

    // Unit tests.
    mochaTest: {
      test: {
        src: ['test/tests.js']
      }
    }
  });



  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [
    'clean',
    'mochaTest'
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};