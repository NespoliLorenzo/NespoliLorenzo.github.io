var data = {},
    gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: '*'
    });


gulp.task('scripts', function(){
    gulp.src([
        './app/src/js/app.js'
        ])
        .pipe(plugins.concat('app.js'))
        .pipe(plugins.minify())
        .pipe(gulp.dest('./app/assets/scripts'));
});
gulp.task('styles', function(){
    gulp.src(['./app/src/scss/*.scss'])
    .pipe(plugins.sass({
        outputStyle: 'compressed',
        includePaths: []
    }).on('error',plugins.sass.logError))
    .pipe(gulp.dest('./app/assets/css/'))
});

gulp.task('tpl', function(){
    // var data = JSON.parse(plugins.fs.readFileSync('./app/assets/json/db.json'));
    var n = 1;
    var options = {
        batch : ['./app/components'],
        helpers : {
            capitals : function(str){
                return str.toUpperCase();
            },
            n: function(str,options){
                return n++;
            },
            ifFirst: function (index, options) {
                if(index == 0){
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },
            slugify: function(str){
                return str.toString().toLowerCase()
                        .replace(/\s+/g, '-')           // Replace spaces with -
                        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                        .replace(/^-+/, '')             // Trim - from start of text
                        .replace(/-+$/, '');            // Trim - from end of text
            }
        }
    }

    gulp.src([
        './app/*.html'
        ])
        .pipe(plugins.compileHandlebars(data, options))
        .pipe(plugins.injectString.replace('{%','{{'))
        .pipe(plugins.injectString.replace('%}','}}'))
        .pipe(plugins.htmlmin({collapseWhitespace: true, minifyJS: true, minifyCSS: true }))
        .pipe(gulp.dest('./'));


});
gulp.task('reload', function(){
    plugins.browserSync.reload('index.html');
});

gulp.task('default',['tpl','scripts','styles'],
    function(){
        console.log('ENVIROMENT: '+ENV);
        console.log('DIRECTORY: '+DIR); 
    }
);

gulp.task('watch',['tpl','styles','scripts'],function(){

    plugins.browserSync.init({
        port: 3000,
        notify: true,
        logPrefix: 'BS',
        server: ['./']
    });

    gulp.watch(['./app/assets/scss/**/*.scss'],['styles', 'reload']);
    gulp.watch(['./app/src/scss/**/*.scss'],['styles', 'reload']);
    gulp.watch(['./app/**/*.html','./app/**/*.hbs','./app/**/*.handlebars'],['tpl','reload']);
    gulp.watch('./app/assets/scripts/**/*.js',['scripts','reload' ]);
    gulp.watch('./app/src/js/**/*.js',['scripts','reload' ]);
});