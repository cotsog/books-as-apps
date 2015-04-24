/*global module */
/*global require */
(function () {
  'use strict';
  module.exports = function (grunt) {
    // require it at the top and pass in the grunt instance
    // it will measure how long things take for performance
    //testing
    require('time-grunt')(grunt);

    // load-grunt will read the package file and automatically
    // load all our packages configured there.
    // Yay for laziness
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

      // JAVASCRIPT TASKS
      // Hint the grunt file and all files under js/
      // and one directory below
      jshint: {
        files: [ 'Gruntfile.js', 'js/{,*/}*.js'],
        options: {
          reporter: require('jshint-stylish')
          // options here to override JSHint defaults
        }
      },

      // Takes all the files under js/ and selected files under lib
      // and concatenates them together. I've chosen not to mangle
      // the compressed file
      uglify: {
        dist: {
          options: {
            mangle: false,
            sourceMap: true,
            sourceMapName: 'css/script.min.map'
          },
          files: {
            'js/script.min.js': [ 'js/video.js', 'lib/highlight.pack.js']
          }
        }
      },

      // SASS RELATED TASKS
      // Converts all the files under scss/ ending with .scss
      // into the equivalent css file on the css/ directory
      sass: {
        dev: {
          options: {
            style: 'expanded'
          },
          files: [ {
            expand: true,
            cwd: 'scss',
            src: [ '*.scss'],
            dest: 'dist/css',
            ext: '.css'
          }]
        },
        production: {
          options: {
            style: 'compact'
          },
          files: [ {
            expand: true,
            cwd: 'scss',
            src: [ '*.scss'],
            dest: 'dist/css',
            ext: '.css'
          }]
        }
      },

      // This task requires the scss-lint ruby gem to be installed on your system
      // If you choose not to install it, comment out this task and the prep-css
      // and work-lint tasks below
      //
      // I've chosen not to fail on errors or warnings.
      scsslint: {
        allFiles: [
          'scss/*.scss',
          'scss/modules/_mixins.scss',
          'scss/modules/_variables.scss',
          'scss/partials/*.scss'],
        options: {
          config: '.scss-lint.yml',
          force: true,
          colorizeOutput: true
        }
      },

      autoprefixer: {
        options: {
          browsers: [ 'last 2' ]
        },

        files: {
          expand: true,
          flatten: true,
          src: 'dist/**/*.css',
          dest: 'dist/**/*.css'
        }
      },

      // CSS TASKS TO RUN AFTER CONVERSION
      // Cleans the CSS based on what's used in the specified files
      // See https://github.com/addyosmani/grunt-uncss for more
      // information
      uncss: {
        dist: {
          files: {
            'css/tidy.css': [ '*.html', '!docs.html']
          }
        }
      },

      // OPTIONAL TASKS
      // Tasks below have been set up but are currently not used.
      // If you want them, uncomment the corresponding block below

      // COFFEESCRIPT
      // If you want to use coffeescript (http://coffeescript.org/)
      // instead of vanilla JS, uncoment the block below and change
      // the cwd value to the locations of your coffee files
      coffee: {
        target1: {
          expand: true,
          flatten: true,
          cwd: 'src/',
          src: ['*.coffee'],
          dest: 'build/',
          ext: '.js'
        }
      },

      // GH-PAGES TASK
      // Push the specified content into the repositories gh-pages branch
      'gh-pages': {
        options: {
          message: 'Content committed from Grunt gh-pages',
          base: 'dist/',
          dotfiles: true
        },
          // These files will get pushed to the `
          // gh-pages` branch (the default)
          // We have to specifically remove node_modules
        src: ['**/*']
      },

      // FILE MANAGEMENT
      // Can't seem to make the copy task create the directory
      // if it doesn't exist so we go to another task to create
      // the fn directory
      mkdir: {
        build: {
          options: {
            create: [ 'dist' ]
          }
        }
      },

      // Copy the files from our repository into the dist directory
      // have to figure out a way to have grunt copy stuff only
      // if specific directories exist and are not empty
      copy: {
        html: {
          files: [ {
            expand: true,
            src: [
              'css/**/*',
              'lib/**/*',
              'js/**/*',
              'images/**/*',
              '**/*.html'],
            dest: 'dist/'
          }]
        }
      },

      // Clean the build directory
      clean: {
        all: [ 'dist/']
      },

      // WATCH TASK
      // Watch for changes on the js and scss files and perform
      // the specified task
      watch: {
        options: {
          nospawn: true
        },
        // Watch all javascript files and hint them
        js: {
          files: [ 'Gruntfile.js', 'js/{,*/}*.js'],
          tasks: [ 'jshint']
        },
        sass: {
          files: [ 'scss/*.scss'],
          tasks: [ 'sass']
        }
      },
    });
    // closes initConfig

    // CUSTOM TASKS
    // Usually a combination of one or more tasks defined above
    grunt.task.registerTask(
      'lint',
      [ 'jshint' ]
    );

    grunt.task.registerTask(
      'lint-all',
      [ 'scsslint', 'jshint']
    );

    // Prep CSS starting with SASS, autoprefix et. al
    grunt.task.registerTask(
      'prep-css',
      [ 'scsslint', 'sass:dev', 'autoprefixer' ]
    );

    grunt.task.registerTask(
      'prep-js',
      [ 'jshint', 'uglify' ]
    );

  };
  // closes module.exports
}
());
// closes the use strict function