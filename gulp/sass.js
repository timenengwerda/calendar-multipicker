var gulp = require('gulp');
var config = require('../gulp/config')
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var scsslint = require('gulp-scss-lint');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

//
// SASS compilation
//
gulp.task('sass', function () {

    gulp.src(config[config.mode].src + '/scss/*.scss')

        // scss-lint
        .pipe(scsslint({
            'config': config[config.mode].src + '/scss/.scss-lint.yml'
        }))

        // compile sass
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))

        .pipe(autoprefixer({
            browsers: ['IE 10', 'IE 11', 'last 2 version'],
            cascade: false
        }))

        // export expanded version(s) to dist folder
        .pipe(gulp.dest(config[config.mode].dest + '/assets/css'))

        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))

        .pipe(rename({ extname: '.min.css' }))

        // export minified version(s) to dist folder
        .pipe(gulp.dest(config[config.mode].dest + '/assets/css'))
        .pipe(browserSync.stream());
});
