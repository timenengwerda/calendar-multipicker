var gulp = require('gulp');
var config = require('./gulp/config');
var requireDir = require('require-dir');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

//
// Get all the tasks we list
// in the gulp folder
//
requireDir('./gulp');

//
// Default watch task, which
//
gulp.task('watch', ['kit', 'javascript', 'sass'], function () {
    browserSync.init({
        server: config[config.mode].dest
    });
    gulp.watch(config[config.mode].src + '/kit/**/*.kit', ['kit']);
    gulp.watch(config[config.mode].src + '/js/**/*.js', ['javascript']);
    gulp.watch(config[config.mode].src + '/scss/**/*.scss', ['sass']);

    gulp.watch(config[config.mode].dest + '/*.html').on('change', reload);
    gulp.watch(config[config.mode].dest + '/**/*.css').on('change', reload);
    gulp.watch(config[config.mode].dest + '/**/*.js').on('change', reload);
});

//
// build:frontend
// this task runs the kit, js and sass task width mode:frontend
//
gulp.task('build:frontend', function() {
    config.mode = 'frontend';
    gulp.start('kit', 'sass', 'javascript');
});


//
// build:backend
// this task runs the kit, js and sass task width mode:backend
//
gulp.task('build:backend', function() {
    config.mode = 'backend';
    gulp.start('sass', 'javascript');
});
