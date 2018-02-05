/**
 * gulp 自动化构建工具
 * gulpfile.js 配置文件
 *
 */
var fs, path, gulp, sass, uglify,  clean,  imagemin,htmlminify,csso,
    rev, gutil, plumber, babel,  gulpSequence, autoprefixer, del;

fs = require('fs');
path = require('path');
gulp = require('gulp');
sass = require('gulp-sass'); // sass的编译
uglify = require('gulp-uglify'); // 压缩js代码
clean = require('gulp-clean'); // 清理文件
gutil = require('gulp-util'); // 打印日志 log
plumber = require('gulp-plumber'); // 监控错误
babel = require('gulp-babel'); // 编译ES6
gulpSequence = require('gulp-sequence'); // 顺序执行
del = require('del'); // 删除文件
rev = require('gulp-rev'); //静态文件添加hash值
autoprefixer = require('gulp-autoprefixer'); //为css自动添加浏览器前缀
htmlminify = require('gulp-html-minify'); //压缩HTML
csso = require('gulp-csso'); //压缩优化css
imagemin = require('gulp-imagemin'); // 图片压缩

// 代理请求 / 端口设置 / 编译路径
var config = require('./config.js');

/**
 * 开发环境和生产环境
 * 先清空原先文件夹，在执行编译或者打包
 *
 * @param {any} cb 回调
 */
var cnEnvironment = function (cb) {

    // 先执行清空文件夹内容
    del([config.rootDist]).then(function (paths) {
        // 通知信息
        gutil.log(gutil.colors.green('Message：Delete complete!'));
        gutil.log(gutil.colors.green('Message：Deleted files and folders:', paths.join('\n')));

        // 执行项目打包
        gulpSequence( [
            'scss','css', 'images', 'js', 'es6',
            'publicPlugins','sql',
            'html', 'json', 'fonts', 'data'], function () {
            gutil.log(gutil.colors.green('Message：Compile finished!'));
            // 执行回调
            cb && cb();

        });
    });
}

/**
 * 错误输出
 *
 * @param {any} error
 */
var onError = function (error) {
    var title = error.plugin + ' ' + error.name;
    var msg = title + ':' + error.message;
    var errContent = msg.replace(/\n/g, '\\A '); // replace to `\A`, `\n` is not allowed in css content
    gutil.log(gutil.colors.red(errContent));
    this.emit('end');
};

/* 字体 输出*/
gulp.task('fonts', function () {
    return gulp
        .src(config.dev.fonts)
        .pipe(plumber(onError))
        .pipe(gulp.dest(config.dist.fonts))
});
/* json 输出*/
gulp.task('json', function () {
    return gulp
        .src(config.dev.json)
        .pipe(plumber(onError))
        .pipe(gulp.dest(config.dist.json))
});
/* data 输出 */
gulp.task('data', function () {
    return gulp
        .src(config.dev.data)
        .pipe(gulp.dest(config.dist.data))
});
/* sql 输出 */
gulp.task('sql', function () {
    return gulp
        .src(config.dev.sql)
        .pipe(gulp.dest(config.dist.sql))
});
/* publicPlugins 输出 */
gulp.task('publicPlugins', function () {
    return gulp
        .src(config.dev.public)
        .pipe(plumber(onError))
        .pipe(gulp.dest(config.dist.public))
});

/* html 输出*/
gulp.task('html', function () {
    return gulp.src(config.dev.html)
            .pipe(plumber(onError))
            .pipe(gulp.dest(config.dist.html))
});
/* images 输出 */
gulp.task('images', function () {
    return gulp
        .src(config.dev.images)
        .pipe(gulp.dest(config.dist.images))
});
/* scss 编译 */
gulp.task('scss', function () {
    return gulp
        .src(config.dev.scss)
        .pipe(plumber(onError))
        .pipe(sass())
        .pipe(gulp.dest(config.dist.css))
});
/* css  处理并输出 */
gulp.task('css', function () {
    gulp.src(config.distmin.css)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],      // 浏览器版本
            cascade: true,                   // 美化属性，默认true
            add: true,                      // 是否添加前缀，默认true
            remove: true,                      // 删除过时前缀，默认true
            flexbox: true                   // 为flexbox属性添加前缀，默认true
        }))
        .pipe(rev()) //随机添加hash值
        .pipe(gulp.dest(config.dist.css));  //输出
});
/* es6 编译 */
gulp.task('es6', function () {
    gulp.src([config.dev.es6, '!node_modules/**'])
         .pipe(plumber(onError))
         .pipe(babel({presets: ['es2015']}))
         .pipe(gulp.dest(config.dist.js))

});
/* js 处理并输出 */
gulp.task('js', function () {
    gulp.src(config.distmin.js)
        .pipe(rev()) //随机添加hash值
        .pipe(gulp.dest(config.dist.js))  //输出
});





/* watch 文件 */
gulp.task('watch', function () {
    // 看守所有.scss文件
    gulp.watch(config.dev.scss, ['scss']);
    // 看守所有图片文件
    gulp.watch(config.dev.images, ['images']);
    // 看守所有es6文件
    gulp.watch(config.dev.es6, ['es6']);
    //看守所有plugins文件
    gulp.watch(config.dev.public, ['publicPlugins']);
    // 看守所有.html文件
    gulp.watch(config.dev.html, ['html']);
    // 看守所有.json文件
    gulp.watch(config.dev.json, ['json']);
    // 看守所有 data 后台文件
    gulp.watch(config.dev.data, ['data']);
    // 看守所有fonts文件
    gulp.watch(config.dev.fonts, ['fonts']);
    // 看守所有sql文件
    gulp.watch(config.dev.sql, ['sql']);
    // 看守所有css文件
    gulp.watch(config.dist.css, ['css']);
    // 看守所有js文件
    gulp.watch(config.dist.js, ['js']);
});

/* 开发环境 */
gulp.task('dev', function () {
    cnEnvironment(function () {
        // 监听watch
        gulp.start('watch');
    });

});

/* 生产打包项目 */
gulp.task('build', function () {
    cnEnvironment(function () {
        gutil.log(gutil.colors.green('Message：Project package is complete'));
    })
});

//HTML压缩
gulp.task('minhtml',function(){
    gulp.src(config.dev.html)
        .pipe(htmlminify())
        .pipe(gulp.dest(config.dist.html))
});
//js压缩任务
gulp.task('jsmin', function () {
    gulp.src(config.distmin.js)
        .pipe(uglify())    //压缩
        .pipe(gulp.dest(config.dist.js));  //输出
});
//css压缩任务
gulp.task('cssmin', function () {
    gulp.src(config.distmin.css)
        .pipe(csso())
        .pipe(plumber(onError))
        .pipe(gulp.dest(config.dist.css))  //输出
});
//图片压缩任务
gulp.task('minimg', function () {
    return gulp.src(config.distmin.images)
        .pipe(imagemin())    //压缩
        .pipe(gulp.dest(config.dist.images));
});
//压缩任务(操作执行任务)
gulp.task('min', function () {
    gulp.run('minhtml','jsmin','cssmin','minimg');
});

/* clean 清除*/
gulp.task('clean', function () {
    del(config.rootDist).then(function (paths) {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});


/* 任务命令 */
gulp.task('default', function () {
    gutil.log(gutil.colors.green('开发环境：      npm run dev 或者 gulp dev'));
    gutil.log(gutil.colors.green('打包项目：      npm run build 或者 gulp build --env production'));
    gutil.log(gutil.colors.green('删除文件夹：    gulp clean'));
    gutil.log(gutil.colors.green('监听所有文件：  gulp watch'));
    gutil.log(gutil.colors.green('压缩img/css/js：gulp min'));
});

