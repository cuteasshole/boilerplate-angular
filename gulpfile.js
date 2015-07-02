'use strict';

var gulp = require('gulp');
var extender = require('gulp-html-extend');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var rev = require('gulp-rev');


// fileinclude
gulp.task('extender', function() {
  gulp.src(['app/template/[^_]*.html'])
  .pipe(extender({annotations:false,verbose:false}))
  .pipe(gulp.dest('public'));
});

// sass
gulp.task('sass', function () {
  gulp.src('app/sass/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(rename({
     extname: '.min.css'
   }))
  .pipe(rev())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('public/css'))
  .pipe(rev.manifest('manifest.json'))
  .pipe(gulp.dest('public/css'));
});


// uglifyJS
gulp.task('uglify', function() {
  return gulp.src('app/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({
       extname: '.min.js'
     }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js'));
});

// Static server
gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: "public"
    }
  });
  gulp.watch(['app/**/*.{scss,css}'], ['sass', reload]);
  gulp.watch(['app/**/*.js'], ['uglify', reload]);
  gulp.watch(['app/**/*.html'], ['extender', reload]);
});

// Build and serve the output from the dist build
gulp.task('serve:public', ['default'], function () {
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    // will present a certificate warning in the browser.
    // https: true,
    server: 'public'
  });
});

// Build production files, the default task
gulp.task('default', ['sass', 'extender']);
