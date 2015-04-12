var
  // require gulp and gulp if plugin
  gulp = require('gulp'),
  gulpif = require('gulp-if'),
  // SASS and SASS-Related plugins
  sass = require('gulp-ruby-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  scsslint = require('gulp-scsslint'),
  // Plugins for tasks to run on transformed CSS
  autoprefixer = require('gulp-autoprefixer'),
  uncss = require('gulp-uncss-task'),
  // js task plugins
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  // Plugins for other tasks
  ghPages = require('gulp-gh-pages'),
  coffee = require('gulp-coffee'),
  shell = require('gulp-shell'),
  webserver = require('gulp-webserver');

/**
 * Our primary task is to get SCSS transformed to CSS and to create the
 * corresponding sourcemaps
 *
 * Note that all SASS tasks require Ruby and the SASS Gem (3.4 or later)
 * to be installed
*/

gulp.task('sass-app', function() {
    return sass('./scss/{,*/}*.scss', {
      verbose: true,
      sourcemap: true
    })
.on('error', function (err) {
      console.error('Error', err.message);
   })
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'));
});


// SCSS Lint Task
// Note that thsi task requires Ruby and the SCSS Lint gem to be installed
gulp.task('scss-lint', function () {
  gulp.src('./scss/{,*/}*.scss')
    .pipe(scsslint())
    .pipe(scsslint.reporter());
});

// Gulp JSHINT Task
gulp.task('jshint', function () {
  gulp.src(['**/*/js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

// Uglify Task
gulp.task('scripts', function () {
  return gulp.src('**/*.js')
    .pipe(gulpif(options.env === 'production', uglify())) // only minify in production
    .pipe(gulp.dest('dist'));
});

gulp.task('jsvendor', function() {
  return gulp.src('js/vendor/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(gulpif(options.env === 'production', concat('all.js'))) // only in production
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

// GH-Pages Task
gulp.task('deploy', function () {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('prefixfree', function () {
  return gulp.src('./app/css/{,*/}*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('uncss', function () {
  gulp.src('./app/css/{,*/}*.css')
    .pipe(uncss({
      html: ['./app/{,*/}*.html']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('coffee', function () {
  gulp.src('**/*.coffee')
    .pipe(coffee({
      bare: true
    }).on('error', gutil.log))
    .pipe(gulp.dest('dist'))
});

gulp.task('example', function () {
  return gulp.src('*.js', {read: false})
    .pipe(shell([
      'echo <%= f(file.path) %>',
      'ls -l <%= file.path %>'
    ], {
      templateData: {
        f: function (s) {
          return s.replace(/$/, '.bak')
        }
      }
    }))
});

gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      path: '.',
      livereload: true,
      directoryListing: true,
      open: true
    }));
});



// Create Gulp Default Task
// ------------------------
// Having watch within the task ensures that 'sass' has already ran before watching
//
// This setup is slightly different from the one on the blog post at
// http://www.zell-weekeat.com/gulp-libsass-with-susy/#comment-1910185635
gulp.task('default', ['sass'], function () {
  gulp.watch('./scss/{,*/}*.scss', ['sass'])
});

gulp.task('jshint', ['jshint'], function () {});
