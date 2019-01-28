var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var gulpSass = require('gulp-sass');
var csso = require('gulp-csso');
var postcss = require('gulp-postcss');

const utils = require('../../build/utils.js');


var projectName = 'pickerView';

var $base_path = './src/';//src path
var $base_dist_path = './lib/';//dist path

//task fo js handle
gulp.task('js-handle', function () {
    gulp.src($base_path + '**/*.js')
        .pipe(babel())
        .pipe(uglify({
            mangle: true,
            compress: true
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest($base_dist_path))
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(notify({message: '===== babel and uglify task complete ====='}));
});

// compile component css
gulp.task('compile-scss', () => (
    gulp
        .src([path.resolve($base_path + 'style/index.scss')])
        .pipe(gulpSass({
            paths: [path.resolve(__dirname, 'node_modules')]
        }))
        .pipe(postcss())
        .pipe(csso())
        .pipe(rename({basename: projectName, suffix: '.min'}))
        .pipe(gulp.dest($base_dist_path))
));

gulp.task('watch', () => {
    gulp.watch($base_path + '**/*.js', ['js-handle']).on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + utils.showinfo() + '')
    });
    gulp.watch($base_path + '**/*.scss', ['compile-scss']).on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + utils.showinfo() + '')
    });
});

gulp.task('default', ['js-handle', 'compile-scss', 'watch']);

