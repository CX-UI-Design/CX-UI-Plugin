var gulp = require('gulp');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var gutil = require('gulp-util');
var notify = require('gulp-notify');


var _base_path = 'src/';
var _base_dist_path = '../lib';

var t = 0;       								       //计数开始为0
var showinfo = function () {
  t++;
  var curDate = new Date();
  var Year = curDate.getFullYear().toString().slice(-2);
  var Month = ('0' + (curDate.getMonth() + 1)).slice(-2);
  var Day = ('0' + curDate.getDate()).slice(-2);
  var Hours = ("0" + curDate.getHours()).slice(-2);
  var Minutes = ("0" + curDate.getMinutes()).slice(-2);
  return FullDate = '\n' + '           - Author : 高仓雄（gcx / Spring of broccoli，Contact ：Wechat（lensgcx）' + '\n' + '           - Date:' + Year + '-' + Month + '-' + Day + '-' + Hours + '-' + Minutes + '\n' + '           - Current: ' + t + 'st refresh loading... ' + '\n' + '           - running tasks...';
};


gulp.task('js-handle', function () {
  gulp.src(_base_path + '**/*.js')
    .pipe(babel())
    .pipe(uglify())
    // .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(_base_dist_path))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(notify({message: '===== babel and uglify task complete ====='}));
});

// copy sh
gulp.task('copy_sh', function () {
  gulp.src(_base_path + 'menu.sh')
    .pipe(gulp.dest(_base_dist_path))
    .pipe(notify({message: '===== menu.sh copy complete ====='}));
  gulp.src(_base_path + 'sh/**/*.*')
    .pipe(gulp.dest(_base_dist_path + '/sh'))
    .pipe(notify({message: '===== command.sh copy complete ====='}));
});

// copy img
gulp.task('copy_img', function () {
  gulp.src(_base_path + 'logo.png')
    .pipe(gulp.dest(_base_dist_path))
    .pipe(notify({message: '===== logo copy complete ====='}));
});


gulp.task('watch', () => {
  gulp.watch(_base_path + '**/*.js', ['js-handle']).on('change', function (event) {
    console.log('File ' + event.path + ' was ' + event.type + showinfo() + '')
  });
  gulp.watch(_base_path + 'menu.sh', ['copy_sh']).on('change', function (event) {
    console.log('File ' + event.path + ' was ' + event.type + showinfo() + '')
  });
});

gulp.task('default', ['js-handle', 'copy_sh', 'copy_img', 'watch']);

