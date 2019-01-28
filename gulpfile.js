var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var obfuscate = require('gulp-obfuscate');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var gulpSass = require('gulp-sass');
var csso = require('gulp-csso');
var postcss = require('gulp-postcss');

const utils = require('./build/utils.js');//unit fn


var $base_path = './packages/';//src path
var $base_dist_path = './lib/';//dist path

var $base_path__js = (folder) => $base_path + folder + '/src/**/*.js';//src js path
var $base_path__css = (folder) => $base_path + folder + '/src/style/index.scss';//src css path


//task fo js handle
gulp.task('js-handle', function () {
    var folders = utils.getFolders($base_path);
    return folders.map(function (folder) {
        gulp.src($base_path__js(folder))
            .pipe(babel())
            .pipe(uglify({
                mangle: true,
                compress: true
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest($base_dist_path + folder))
            .on('error', function (err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
            })
            .pipe(notify({message: '===== babel and uglify task complete ====='}));
    });
});

// compile component css
gulp.task('compile-scss', function () {
    var folders = utils.getFolders($base_path);
    return folders.map(function (folder) {
        gulp.src([path.resolve($base_path__css(folder))])
            .pipe(gulpSass({
                paths: [path.resolve(__dirname, 'node_modules')]
            }))
            .pipe(postcss())
            .pipe(csso())
            .pipe(rename({basename: folder, suffix: '.min'}))
            .pipe(gulp.dest($base_dist_path + folder))
    });
});

gulp.task('watch', () => {
    gulp.watch($base_path + '**/*.js', ['js-handle']).on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + utils.showinfo() + '')
    });
    gulp.watch($base_path + '**/*.scss', ['compile-scss']).on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + utils.showinfo() + '')
    });
});

//all run
gulp.task('default', ['js-handle', 'compile-scss', 'watch']);

