// 存放未编译的文件夹
const ROOT_DEV = 'src';
// 存放编译过后的文件夹
const ROOT_DIST = 'dist';
const DATA = 'dist';
// 存放公共JS、CSS文件夹
const ROOT_PUBLIC = 'plugins';
// 存放公共后台文件夹
const ROOT_DATA = 'data';
// 存放SQL文件夹
const ROOT_SQL = 'sql';


module.exports = {

    rootDev: ROOT_DEV,
    rootDist: ROOT_DIST,
    rootData: ROOT_DATA,

    // 未编译的路径
    dev: {
        css: ROOT_DEV + '/css/**/*.css',
        scss: ROOT_DEV + '/scss/**/*.scss',
        fonts: ROOT_DEV + '/fonts/**/*.*',
        html: ROOT_DEV + '/**/*.html',
        images: [ROOT_DEV + '/images/**/*.{png,jpg,gif,ico}'],
        js: ROOT_DEV + '/js/**/*.js',
        es6: ROOT_DEV + '/js/**/*.es6',
        json: ROOT_DEV + '/json/**/*.*',
        public: ROOT_PUBLIC + '/**/*.*',
        data: ROOT_DATA + '/**/*.*',
        sql: ROOT_SQL + '/*.*'
    },
    ignore: {
        js: '!' + ROOT_DEV + '/js/user/vue-waterfall.min.js'
    },
    //压缩文件
    distmin: {
        css: ROOT_DIST + '/static/css/**/*.css',
        images: [ROOT_DIST + '/static/images/**/*.{png,jpg,gif,ico}'],
        js: ROOT_DIST + '/static/js/**/*.js'
    },
    // 编译过后的路径
    dist: {
        css: ROOT_DIST + '/static/css/',
        fonts: ROOT_DIST + '/static/fonts/',
        html: ROOT_DIST + '/',
        images: ROOT_DIST + '/static/images/',
        js: ROOT_DIST + '/static/js/',
        json: ROOT_DIST + '/static/json/',
        public: ROOT_DIST + '/static/plugins/',
        data: DATA + '/data/',
        sql: DATA + '/sql/'
    }
};
