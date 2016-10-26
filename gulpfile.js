var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    os = require('os'),
    open = require('gulp-open');


// Default usage:
// Open one file with default application

gulp.task('open', function(){
  gulp.src('http://risa.local:4200')
  .pipe(open());
});


var browser = os.platform() === 'linux' ? 'google-chrome' : (
  os.platform() === 'darwin' ? 'google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));

gulp.src('./package.json').pipe(open({app: 'chrome'}));


// Simple usage, no options.
// This will use the uri in the default browser

gulp.task('uri', function(){
  gulp.src(__filename)
  .pipe(open({uri: 'http://risa.local:4200'}));
});



gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 35729}));
  app.use(express.static(__dirname));
  app.listen(4200, 'risa.local');
});

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('styles', function() {
  return sass('scss/**/*.scss', { style: 'expanded' })
    .pipe(gulp.dest('css'));
});

gulp.task('watch', function() {
  gulp.watch('scss/*.scss', ['styles']);
  gulp.watch('*.html', notifyLiveReload);
  gulp.watch('css/*.css', notifyLiveReload);
});

gulp.task('default', ['styles', 'express', 'livereload', 'watch', 'uri'], function() {

});
