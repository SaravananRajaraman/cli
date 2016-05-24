
var $        = require('gulp-load-plugins')();
var argv     = require('yargs').argv;
var gulp     = require('gulp');
var rimraf   = require('rimraf');
var sequence = require('run-sequence');
var ip       = require('ip').address();

// Check for --production flag
var isProduction = !!(argv.production);

var paths = {

  images: [
    'images/**/*.*'
  ],

  js: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/what-input/what-input.js',
    'bower_components/foundation-sites/dist/foundation.js',
    'js/**/*.*',
  ],

  css: [
    'css/**/*.css'
  ],

  html: [
    'index.html',
    'templates/**/*.*'
  ],

  // Sass will check these folders for files when you use @import.
  sass: [
    'bower_components/foundation-sites/scss',
    'bower_components/motion-ui/src'
  ]
}

// Cleans the build directory
gulp.task('clean', function(cb) {
  rimraf('build', cb);
});

// Copies everything include HTML, JS, CSS, and IMAGES
gulp.task('copy',['copy:html','copy:js','copy:css']);

//Copies HTML files and templates html files
gulp.task('copy:html',function() {
  return gulp.src(paths.html, {
    base: './' //this will provide the base of copying a file
    })
    .pipe(gulp.dest('build'))
  ;
});

//Copies jsLibs(bower) & costom js
gulp.task('copy:js', function() {

    var uglify = $.if(isProduction, $.uglify()
      .on('error', function (e) {
        console.log(e);
      }));
    return gulp.src(paths.js, {
      base: './' //this will provide the base of copying a file
      })
      .pipe(uglify)
      //.pipe($.concat('app.js')) //this will make the single js file
      .pipe(gulp.dest('build'))
    ;
});

//Copies Css
gulp.task('copy:css',['sass'], function() {
  return gulp.src(paths.css, {
    base: './'
    })
    .pipe(gulp.dest('build'))
  ;
});

// Compiles Sass
gulp.task('sass', function () {
  var minifyCss = $.if(isProduction, $.minifyCss());

  return gulp.src('scss/app.scss')
    .pipe($.sass({
      includePaths: paths.sass,
      outputStyle: (isProduction ? 'compressed' : 'nested'),
      errLogToConsole: true
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(minifyCss)
    .pipe(gulp.dest('css'))
  ;
});



// Starts a test server, which you can view at your localhost
gulp.task('server', ['build'], function() {
  gulp.src('./build')
    .pipe($.webserver({
      port: 3110,
      host: ip,
      fallback: 'index.html',
      livereload: true,
      open: true
    }))
  ;
});

// Default task: builds your app, starts a server, and recompiles assets when they change
gulp.task('default', ['server'], function () {
  // Watch Sass
  gulp.watch(['scss/**/*'], ['sass']);

  // Watch JavaScript
  gulp.watch(['js/**/*'], ['copy:js']);

  // Watch static files
  gulp.watch(['./**/*.html'], ['copy:html']);
});

// Builds your entire app once,
gulp.task('build', function(cb) {
  sequence('clean', ['copy'], cb);
});

// gulp.task('default', ['sass'], function() {
//   gulp.watch(['scss/**/*.scss'], ['sass']);
// });
