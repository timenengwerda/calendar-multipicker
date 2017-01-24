var gulp = require('gulp');
var config = require('../gulp/config')
var kit = require('gulp-kit');
var browserSync = require('browser-sync').create();

gulp.task('kit', function() {
    gulp.src(config[config.mode].src + '/kit/**/*.kit')
        .pipe(kit({
            compilePartials: false
        }))
        .pipe(gulp.dest(config[config.mode].dest))
        .pipe(browserSync.stream());

});
