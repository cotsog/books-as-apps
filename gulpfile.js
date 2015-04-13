var gulp = require('gulp');
var gulpif = require('gulp-if')
var sass = require('gulp-ruby-sass');
var autoprefixer = ('gulp-autoprefixer');
var coffe = ('gulp-coffee');
var concat = ('gulp-concat');
var ghPages = ('gulp-gh-pages');
var jshint = ('gulp-jshint');
var rimraf = ('gulp-rimraf');
var shell = ('gulp-shell');
var scsslint = require('gulp-scss-lint');
var sourcemaps = ('gulp-sourcemaps');
var uglify = ('gulp-uglify');
var uncss = ('gulp-uncss-task');
var webserver = ('gulp-webserver');
var stylish = ('jshint-stylish');
var parker = ('parker');
var gulpparker = ('gulp-parker');

var paths = {
 scripts: ['scripts/**/*.js'],
 libs: ['lib/**/*.js'],
 styles: ['css/**/*.css'],
 html: ['**/*.html'],
 images: ['images/**/*'],
};

var bases = {
  app: 'app/',
  dist: 'dist/',
};
/**
 * Our primary task is to get SCSS transformed to CSS and to create the
 * corresponding sourcemaps
 *
 * Note that all SASS-related tasks require Ruby and the corresponding
 * Gem (3.4 or later) to be installed
*/

gulp.task('sass', [''], function() {
    return sass('./sass/main.scss', {
      verbose: true,
      lineNumbers: true,
      noCache: true
    })
.on('error', function (err) {
      console.error('Error', err.message);
   })
    .pipe(gulp.dest('./css'));
});


// SCSS Lint Task
// Note that this task requires Ruby and the SCSS Lint gem to be installed
gulp.task('scsslint', [''], function() {
  gulp.src('/scss/*.scss')
    .pipe(scsslint());
});

// Gulp JSHINT Task
gulp.task('jshint', [''], function () {
  gulp.src(['**/*/js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

// Uglify Task
gulp.task('scripts', [''], function () {
  return gulp.src('js/**/*.js')
    .pipe(gulpif(options.env === 'production', uglify())) // only minify in production
    .pipe(gulp.dest('dist'));
});

gulp.task('jsvendor', [''], function() {
  return gulp.src('js/vendor/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(gulpif(options.env === 'production', concat('vendor.js'))) // only in production
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

// GH-Pages Task
gulp.task('deploy', [''], function () {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('prefixfree', [''], function () {
  return gulp.src('./app/css/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('uncss', [''], function () {
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

gulp.task('shell', function () {
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

gulp.task('webserver', ['copy'], function() {
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

gulp.task('parker', [''], function() {
  return gulp.src('./css/*.css')
    .pipe(parker({
      file: 'report.md',
      title: 'Gulp test report'
  }));
});

// Create Gulp Tasks
// ------------------------
gulp.task('default', ['sass'], function () {
//  gulp.watch('./scss/{,*/}*.scss', ['sass'])
});

gulp.task('jshint', ['jshint'], function () {});

gulp.task('processSass', ['scss-lint', 'sass'], function () {});

gulp.task('clean', [''], function () {
  return gulp.src('./dist/**/*', { read: false }) // much faster
    .pipe(rimraf());
});

gulp.task('server', ['webserver'], function () {});

// Copy all other files to dist directly
gulp.task('copy', ['clean'], function() {
 // Copy html
 gulp.src(paths.html, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist));

 // Copy styles
 gulp.src(paths.styles, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist + 'styles'));

 // Copy lib scripts, maintaining the original directory structure
 gulp.src(paths.libs, {cwd: 'app/**'})
 .pipe(gulp.dest(bases.dist));

 // Copy extra html5bp files
 gulp.src(paths.extras, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist));
});
