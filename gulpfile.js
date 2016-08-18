// Require gulp
var gulp = require('gulp');

// Require plugins
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var concatCss = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');

gulp.task('sass', function() {
    return gulp.src(['./assets/sass/main.scss'])
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('scripts', function() {
    return gulp.src(['./assets/js/*.js'])
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('templates', function() {
    return gulp.src(['./assets/templates/*'])
        .pipe(gulp.dest('./public/templates'));
});

gulp.task('vendor-js', function() {
    return gulp.src(['./assets/js/vendor/jquery.js', './assets/js/vendor/bootstrap.js', './assets/js/vendor/*.js'])
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('vendor-css', function () {
    return gulp.src(['./assets/css/vendor/bootstrap.css', './assets/css/vendor/*.css'])
        .pipe(concatCss('vendor.min.css'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('minify-js', ['scripts', 'vendor-js'], function() {
    return gulp.src(['./public/js/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});

gulp.task('minify-css', ['sass', 'vendor-css'], function() {
    return gulp.src(['./public/css/main.min.css', './public/css/vendor.min.css'])
        .pipe(minifyCss())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('copy-assets', function() {
    var images = gulp.src(['./assets/img/*.jpg'])
        .pipe(gulp.dest('./public/img'));

    var templates = gulp.src(['./assets/templates/*'])
        .pipe(gulp.dest('./public/templates'));
});


gulp.task('minify-templates', ['templates'], function() {
    var opts = {
        conditionals: true,
        spare: true,
        empty: true,
        quotes: true
    };

    return gulp.src(['./public/templates/*.html'])
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest('./public/templates'));
});

gulp.task('watch', function() {
    gulp.watch('./assets/js/*.js', ['scripts']);
    gulp.watch('./assets/js/vendor/*.js', ['vendor-js']);
    gulp.watch('./assets/css/vendor/*.css', ['vendor-css']);
    gulp.watch('./assets/sass/**/*.scss', ['sass']);
    gulp.watch(['./assets/img/*.jpg', './assets/templates/*'], ['copy-assets']);
});

gulp.task('minify', ['minify-css', 'minify-js', 'minify-templates']);
gulp.task('concat', ['vendor-css', 'vendor-js', 'scripts', 'sass', 'copy-assets']);

gulp.task('deploy', ['concat', 'minify']);

gulp.task('default', ['concat', 'copy-assets', 'watch']);
