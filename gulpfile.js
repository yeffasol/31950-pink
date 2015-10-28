'use strict';

var gulp = require('gulp'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    csscomb = require('gulp-csscomb'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    minifyCss = require('gulp-minify-css'),
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    clean = require('gulp-clean'),
    changed = require('gulp-changed'),
    concat = require('gulp-concat'),
    htmlmin = require('gulp-htmlmin'),
    vghPages = require('gulp-gh-pages'),
    path = require('path');

gulp.task('default', ['sass', 'html', 'js', 'browser-sync', 'watch', 'image'], function () {});

gulp.task('sass', function () {
    gulp.src('source/sass/style.scss')
        .pipe(sass())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer({
            browsers: ['last 3 versions']
        })]))
        .pipe(csscomb())
        .pipe(gulp.dest('build/css'))
        .pipe(minifyCss({
            compatibility: 'ie8'
        }))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('build/css/'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('html', function () {
    return gulp.src('source/*.html')
        .pipe(changed('build/'))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('build/'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('js', function () {
    return gulp.src('source/js/*.js')
        .pipe(concat('script.js'))
        .pipe(gulp.dest('build/js'))
        .pipe(uglify())
        .pipe(rename('script.min.js'))
        .pipe(gulp.dest('build/js'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('image', function () {
    return gulp.src('source/img/*.*')
        .pipe(changed('build/img'))
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('build/img'));
});

gulp.task('watch', function () {
    gulp.watch('source/sass/**/*.scss', ['sass']);
    gulp.watch('source/*.html', ['html']);
    gulp.watch('source/js/*.js', ['js']);
});

gulp.task('svg', function () {
    return gulp
        .src('source/img/svg/*.svg')
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            };
        }))
        .pipe(svgstore())
        .pipe(gulp.dest('source/img/'));
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: './build'
        },
        open: false
    });
});

gulp.task('clean', function () {
    return gulp.src('build', {
            read: false
        })
        .pipe(clean());
});

gulp.task('deploy', function () {
    return gulp.src('build/**/*')
        .pipe(ghPages({
            "remoteUrl": "http://yeffasol.github.io/pink/"
        }));
});
