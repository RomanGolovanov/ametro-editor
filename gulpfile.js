'use strict';

var gulp = require('gulp'),
    templateCache = require('gulp-angular-templatecache'),
    prefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    cssmin = require('gulp-minify-css'),
    nodemon = require('gulp-nodemon'),
    open = require('gulp-open'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    svgng = require('gulp-svg-ngmaterial'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),

    exec = require('child_process').exec,
    fs = require('fs'),
    mainBowerFiles = require('main-bower-files'),
    rimraf = require('rimraf');
 
var path = {
    public: {
        root: 'public/',
        img: 'public/img/',
        icons: 'public/img/icons/',
        js: 'public/js/',
        style: 'public/style/'
    },

    src: {
        html: ['src/*.html', 'src/*.ico', '!src/app/**/*.html'],
        templates: 'src/app/**/*.html',
        img: ['src/img/**/*.*', '!src/img/icons/sets/*.svg'],
        icons: 'src/img/icons/sets/*.svg',
        js: ['src/app/*.js', 'src/app/**/*.js', 'src/js/**/*.*'],
        style: 'src/style/**/*.*'
    },

    watch: {
        html: 'src/*.html',
        templates: 'src/app/**/*.html',
        img: 'src/img/**/*.*',
        icons: 'src/img/icons/sets/*.svg',
        js: 'src/**/*.js',
        style: 'src/style/**/*.*'
    },

    clean: './public'
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

gulp.task('templates:build', function () {
    return gulp.src(path.src.templates)
        .pipe(templateCache({
            root: 'app',
            module: 'aMetroEditor'
        }))
        .pipe(gulp.dest(path.public.js));
});

gulp.task('image:build', function () {
    return gulp.src(path.src.img)
        .pipe(gulp.dest(path.public.img));
});

gulp.task('icons:build', function () {
    return gulp.src(path.src.icons)
        .pipe(svgng({ filename : "icons.svg"}))
        .pipe(gulp.dest(path.public.icons));
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
        'templates:build',
        'image:build',
        'js:build',
        'style:build',
        'js:vendor:build',
        'style:vendor:build'
    ]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.templates], function(event, cb) {
        gulp.start('templates:build');
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
    rimraf(path.clean, cb);
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

gulp.task('run', ['build'], function () {
    return nodemon(nodeConfig);
});

gulp.task('browser', ['run'], function () {
    return gulp.src(__filename)
        .pipe(open({ uri: 'http://localhost:3000' }));
});

gulp.task('default', ['db:start', 'watch', 'browser']);



