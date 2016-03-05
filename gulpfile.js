'use strict';

var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    inject = require('gulp-inject'),
    cssmin = require('gulp-minify-css'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    watch = require('gulp-watch'),

    browserSync = require("browser-sync"),
    exec = require('child_process').exec,
    fs = require('fs'),
    mainBowerFiles = require('main-bower-files'),
    rimraf = require('rimraf');
 
var path = {
    public: {
        root: 'public/',
        img: 'public/img/',
        js: 'public/js/',
        style: 'public/style/'
    },

    src: {
        html: ['src/**/*.html', 'src/*.ico'],
        img: 'src/img/**/*.*',
        js: ['src/app/*.js', 'src/app/**/*.js', 'src/js/**/*.*'],
        style: 'src/style/**/*.*'
    },

    watch: {
        html: 'src/**/*.html',
        img: 'src/img/**/*.*',
        js: 'src/**/*.js',
        style: 'src/style/**/*.*'
    },

    clean: './public'
};

var webConfig = {
    online: false,
    port: 9000,
    tunnel: 'ametroeditordev',
    logPrefix: 'ametro-dev',
    serveStatic: [path.public.root],
    proxy: 'http://localhost:3000'
};

var nodeConfig = {
    script: 'index.js', 
    ext: 'js json', 
    watch: ['**\*.js', '!src', '!public', '!gulpfile.js','!data'],
    env: { 'NODE_ENV': 'development' }
};

gulp.task('html:build', function () {
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.public.root));
});

gulp.task('image:build', function () {
    return gulp.src(path.src.img)
        .pipe(gulp.dest(path.public.img));
});

gulp.task('js:build', function () {
    return gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.public.js));
});

gulp.task('style:build', function () {
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.public.style));
});

gulp.task('js:vendor:build', function() {
    return gulp.src(mainBowerFiles('**/*.js'), { base: './bower_components' })
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.public.js));
});

gulp.task('style:vendor:build', function() {
    return gulp.src(mainBowerFiles('**/*.css'), { base: './bower_components' })
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.public.style));
});

gulp.task('build', 
    [
        'html:build',
        'image:build',
        'js:build',
        'style:build',
        'js:vendor:build',
        'style:vendor:build'
    ], 
    function(){});

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
});

gulp.task('clean', function (cb) {
    return rimraf(path.clean, cb);
});

gulp.task('db:start', function (cb) {
    fs.mkdir('data', function(){
        exec('mongod --dbpath data', function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    });

});

gulp.task('server:start', function () {
    nodemon(nodeConfig);
});

gulp.task('www:start', function () { 
    browserSync(webConfig); 
});

gulp.task('default', ['build', 'db:start', 'server:start', 'www:start', 'watch']);



