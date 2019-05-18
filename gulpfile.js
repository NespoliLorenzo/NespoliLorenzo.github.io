const { series, watch, src, dest, parallel } = require('gulp');
const concat       = require('gulp-concat');
const sass         = require('gulp-sass');
const del          = require('del');
const postcss      = require('gulp-postcss');
const sourcemaps   = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const sync         = require('browser-sync').create();
const paths = {
    scripts: {
        vendors: [
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/gsap/src/minified/TweenMax.min.js',
            './node_modules/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',
            './node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js',
        ],
        src: './app/src/js/app.js',
        dest: './app/assets/js/'
    },
    styles: {
        src: './app/src/scss/app.scss',
        watch: './app/src/scss/**/*.scss',
        dest: './app/assets/css/'
    },
    DIR: './app'
};

const clean = () => del([paths.DIR + '/assets/js', paths.DIR + '/assets/css']);

function scripts() {
    var array = new Array();
    array = paths.scripts.vendors;
    array.push(paths.scripts.src);
    return src(array)
    .pipe(concat('app.js'))
    .pipe(dest(paths.scripts.dest));
}

function styles() {
    return src(paths.styles.src)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.styles.dest));
}

function reload(done) {
    sync.reload();
    // setTimeout(function(){
    //     sync.reload(["*.css"]);
    // }, 1000);
    done();
}

function serve (done) {
    sync.init({
        server: {
            baseDir: "./"
        },
        notify: false
    });
    done();
}

function check1() {
    watch([paths.DIR, paths.DIR + '/assets/img/**/*.png', paths.DIR + '/assets/img/**/*.jpeg', './**/*.html'], reload);
}

function check2() {
    watch([paths.scripts.src, paths.styles.watch ], series(clean, parallel(scripts, styles), reload));
}

// la squenza di operazioni che effetuo con il comando gulp
const dev = series(clean, parallel(scripts, styles), serve, parallel(check1, check2));
exports.default = dev;