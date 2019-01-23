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

var _base_path = './src/';
var _base_dist_path = '../../lib/pickerView/';


gulp.task('js-handle', function () {
    gulp.src(_base_path + '**/*.js')
        .pipe(babel())
        .pipe(uglify({
            mangle: true,
            compress: true
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(_base_dist_path))
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(notify({message: '===== babel and uglify task complete ====='}));
});

// compile component css
gulp.task('compile-scss', () => (
    gulp
        .src([path.resolve(_base_path + 'style/**/*.scss')])
        .pipe(gulpSass({
            paths: [path.resolve(__dirname, 'node_modules')]
        }))
        .pipe(postcss())
        .pipe(csso())
        .pipe(gulp.dest(_base_dist_path))
));

gulp.task('watch', () => {
    gulp.watch(_base_path + '**/*.js', ['js-handle']).on('change', function (event) {
        // console.log('File ' + event.path + ' was ' + event.type + showinfo() + '')
    });
    gulp.watch(_base_path + '**/*.scss', ['compile-scss']).on('change', function (event) {
        // console.log('File ' + event.path + ' was ' + event.type + showinfo() + '')
    });
});

gulp.task('default', ['js-handle', 'compile-scss', 'watch']);

