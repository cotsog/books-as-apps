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

      // Takes all the files under js/ and concatenates
      // them together. I've chosen not to mangle the compressed file
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
            cwd: 'sass',
            src: [ '*.scss'],
            dest: 'css',
            ext: '.css'
          }]
        },
        production: {
          options: {
            style: 'compact'
          },
          files: [ {
            expand: true,
            cwd: 'sass',
            src: [ '*.scss'],
            dest: 'css',
            ext: '.css'
          }]
        }
      },

      // This task requires the scss-lint ruby gem to be
      // installed on your system If you choose not to
      // install it, comment out this task and the prep-css
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
          force: true,
          colorizeOutput: true
        }
      },

      // Autoprefixer will check caniuse.com's database and
      // add the necessary prefixes to CSS elements as needed.
      // This saves us from doing the work manually
      autoprefixer: {
        options: {
          browsers: [ 'last 2 versions', 'ie8', 'ie9' ]
        },

        files: {
          expand: true,
          flatten: true,
          src: 'css/*.css',
          dest: 'css/*.css'
        }
      },

      // UNCSS will analyzes the your HTML pages and
      // remove from the CSS all the classes that are
      // not used in any of your HTML pages
      //
      // This task needs to be run in the processed CSS
      // rather than the SCSS files
      //
      //See https://github.com/addyosmani/grunt-uncss
      // for more information
      uncss: {
        dist: {
          files: {
            'css/main.css': [ '*.html', '!docs.html']
          }
        }
      },

      // COFFEESCRIPT
      // If you want to use coffeescript (http://coffeescript.org/)
      // instead of vanilla JS, uncoment the block below and change
      // the cwd value to the locations of your coffee files
      coffee: {
        files: {
          expand: true,
          flatten: true,
          cwd: 'coffee',
          src: ['*.coffee'],
          dest: 'js/',
          ext: '.js'
        }
      },

      // BABEL
      // Babel allows you to transpile ES6 to current ES5 without needing
      // a plugin or anything installed in your application. This will
      // eventually go away when I'm happy with ES6 support in browsers
      // See http://babeljs.io/ for more information.
      babel: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'es6/*.js': 'src/*.js'
            }
        }
      },

      // GH-PAGES TASK
      // Push the specified content into the repositories
      // gh-pages branch
      'gh-pages': {
        options: {
          message: 'Content committed from Grunt gh-pages',
          base: 'dist/',
          dotfiles: true
        },
        // These files will get pushed to the `
        // gh-pages` branch (the default)
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

      // Copy the files from our repository into the dist
      // directory
      copy: {
        dist: {
          files: [ {
            expand: true,
            src: [
              'fonts/**/*',
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
        all: [ 'dist/' ]
      },

      // WATCH TASK
      // Watch for changes on the js and scss files and
      // perform the specified task
      watch: {
        options: {
          livereload: true
        },
        // Watch all javascript files and hint them
        js: {
          files: [ 'Gruntfile.js', 'js/{,*/}*.js'],
          tasks: [ 'jshint'],
          options: {
            livereload: true,
          },
        },
        sass: {
          files: [ 'sass/*.scss'],
          tasks: [ 'sass:dev'],
          options: {
            livereload: true,
          },
        }
      },

      connect: {
        draft: {
          options: {
            base: '.',
            port: 2509,
            keepalive: true,
            livereload: true,

          }
        },
        production: {
          options: {
            base: 'dist',
            keepalive: true,
            livereload: true,
            port: 2510,
          }
        }
      },

      // grunt-open will open your browser at the project's URL
      open: {
        all: {
          // Gets the port from the connect configuration
          path: 'http://0.0.0.0:2509'
        }
      },

    });
    // closes initConfig

    // CUSTOM TASKS
    // Usually a combination of one or more tasks defined above

    grunt.task.registerTask(
      'local-server',
      [ 'connect', 'open' ]
    );

    grunt.task.registerTask(
      'lint',
      [ 'jshint' ]
    );

    grunt.task.registerTask(
      'publish',
      [ 'clean:all', 'copy:dist', 'gh-pages' ]
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
