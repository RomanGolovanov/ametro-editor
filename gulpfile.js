'use strict';

var fs = require('fs'),
    gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    ngAnnotate = require('gulp-ng-annotate'),
    prefixer = require('gulp-autoprefixer'),
    inject = require('gulp-inject'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    mainBowerFiles = require('main-bower-files'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    exec = require('child_process').exec,
    reload = browserSync.reload;
 
var app = "app.js";
var path = {
    build: {
        www: {
            root: 'build/wwwroot/',
            img: 'build/wwwroot/img/',
            js: 'build/wwwroot/js/',
            style: 'build/wwwroot/style/'
        },
        server: 'build/srv/',
        db: 'build/db/'
    },
    src: {
        www: {
            html: ['src/wwwroot/**/*.html', 'src/wwwroot/*.ico'],
            img: 'src/wwwroot/img/**/*.*',
            js: ['src/wwwroot/app/*.js', 'src/wwwroot/app/**/*.js', 'src/wwwroot/js/**/*.*'],
            style: 'src/wwwroot/style/**/*.*'
        },
        server: 'src/srv/**/*.*',
        db: 'src/db/'
    },
    watch: {
        www: {
            html: 'src/wwwroot/**/*.html',
            img: 'src/wwwroot/img/**/*.*',
            js: 'src/wwwroot/**/*.js',
            style: 'src/wwwroot/style/**/*.*'
        }, 
        server: 'src/srv/**/*.*'
    },
    clean: './build'
};

var webConfig = {
    online: false,
    port: 9000,
    tunnel: 'ametroeditordev',
    logPrefix: 'ametro-dev',
    serveStatic: [path.build.www.root],
    proxy: 'http://localhost:3000',
    reloadDelay: 1000,
    reloadDebounce: 2000
};

var nodeConfig = {
    script: path.build.server + app, 
    ext: 'js json', 
    watch: path.build.server,
    env: { 'NODE_ENV': 'development' }
};

gulp.task('server:build', function () {
    return gulp.src(path.src.server)
        .pipe(gulp.dest(path.build.server))
        .pipe(reload({stream: true}));
});


gulp.task('html:www:build', function () {
    return gulp.src(path.src.www.html)
        .pipe(gulp.dest(path.build.www.root))
        .pipe(reload({stream: true}));
});

gulp.task('image:www:build', function () {
    return gulp.src(path.src.www.img)
        .pipe(gulp.dest(path.build.www.img))
        .pipe(reload({stream: true}));
});

gulp.task('js:www:build', function () {
    return gulp.src(path.src.www.js)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.build.www.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:www:build', function () {
    return gulp.src(path.src.www.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.build.www.style))
        .pipe(reload({stream: true}));
});

gulp.task('js:vendor:build', function() {
    return gulp.src(mainBowerFiles('**/*.js'), { base: './bower_components' })
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.build.www.js));
});

gulp.task('style:vendor:build', function() {
    return gulp.src(mainBowerFiles('**/*.css'), { base: './bower_components' })
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.build.www.style));
});

gulp.task('build', 
    [
        'html:www:build',
        'image:www:build',
        'js:www:build',
        'style:www:build',
        'js:vendor:build',
        'style:vendor:build',
        'server:build'
    ], 
    function(){});

gulp.task('watch', function(){
    watch([path.watch.server], function(event, cb) {
        gulp.start('server:build');
    });
    watch([path.watch.www.html], function(event, cb) {
        gulp.start('html:www:build');
    });
    watch([path.watch.www.img], function(event, cb) {
        gulp.start('image:www:build');
    });
    watch([path.watch.www.js], function(event, cb) {
        gulp.start('js:www:build');
    });
    watch([path.watch.www.style], function(event, cb) {
        gulp.start('style:www:build');
    });
});

gulp.task('clean', function (cb) {
    return rimraf(path.clean, cb);
});

gulp.task('db:start', function (cb) {
    
    //TODO: workaround, need another implementation
    try{ fs.mkdirSync(path.build.db); }catch(e){} 

    exec('mongod --dbpath ' + path.build.db, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
})

gulp.task('server:start', function () {
    nodemon(nodeConfig);
})  

gulp.task('www:start', function () { 
    browserSync(webConfig); 
});

gulp.task('default', ['build', 'db:start', 'server:start', 'www:start', 'watch']);



