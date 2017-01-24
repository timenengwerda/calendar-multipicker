var gulp = require('gulp');
var config = require('../gulp/config')
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var babel = require("gulp-babel");
var browserify = require('gulp-browserify');

gulp.task('javascript', function() {

  return gulp.src([config[config.mode].src + '/js/*.js', '!node_modules/**', '!3rdparty/**'])
    // .pipe(eslint({
    //     configFile: '.eslintrc'
    // }))
    .pipe(eslint.format())
    .pipe(eslint.results(function (results) {
        console.log('---')
        console.log('Total Warnings: ' + results.warningCount);
        console.log('Total Errors: ' + results.errorCount);
    }))
    .pipe(babel({
        presets: ['es2015', 'stage-2']
    }))
    .pipe(browserify({
        insertGlobals : true,
        debug : !gulp.env.production
    }))
    .pipe(uglify())
    .pipe(gulp.dest(config[config.mode].dest + '/assets/js'));
});

