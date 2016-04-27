var gulp        = require('gulp'),
    less        = require('gulp-less'),
    cssmin      = require('gulp-cssmin'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    changed     = require('gulp-changed'),
    runSequence = require('run-sequence'),
    plumber     = require('gulp-plumber'),
    svgSymbols  = require('gulp-svg-symbols'),
    fileinclude = require('gulp-file-include'),
    spritesmith = require('gulp.spritesmith');

var path = {
  js: ['dev/assets/js/**/*.js', '!dev/assets/js/**/*.min.js'],
  less: ['dev/assets/less/**/*.less'],
  css: ['dev/assets/css/**/*.css', '!dev/assets/css/**/*.min.css'],
  img: ['dev/assets/img/**/*'],
  html: ['dev/pages/**/*.html', '!dev/pages/partials/*.html']
};

gulp.task('fileinclude', function() {
  gulp.src(path.html)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./dev'))
    .pipe(reload({stream:true}));
});

gulp.task('sprite', function () {
  var spriteData = gulp.src('assets/img/partials/*.png')
  .pipe(spritesmith({
    imgPath: 'assets/img/sprite.png',
    imgName: 'sprite.png',
    cssName: 'sprite.less',
    cssFormat: 'less',
    algorithm: 'binary-tree'
  }));
  spriteData.img.pipe(gulp.dest('assets/img/'));
  spriteData.css.pipe(gulp.dest('assets/less/'));
});

gulp.task('spritesvg', function () {
  return gulp.src('assets/img/svg/*.svg')
    .pipe(svgSymbols({
      templates: ['default-svg']
    }))
    .pipe(gulp.dest('assets/img'));
});

gulp.task('less', function () {
  return gulp.src(path.less)
    .pipe(changed('dev/assets/css/'))
    .pipe(plumber({
      errorHandler: function (err) {
        console.log([
          'Errrroou!',
          '    Erro: ' + err.name + '',
          '  plugin: ' + err.plugin + '',
          'Mensagem: ' + err.message + '',
        ].join('\n'));
        this.emit('end');
      }
    }))
    .pipe(less())
    .pipe(cssmin())
    .pipe(gulp.dest('dev/assets/css/'))
    .pipe(reload({stream:true}));
});

gulp.task('sync', function() {
  browserSync({
    server: {
      baseDir: "./dev"
    }
  });
});


gulp.task('watch', function () {
  gulp.watch(path.less, ['less']);
  gulp.watch('dev/pages/**/*.html', ['fileinclude']);
});

gulp.task('js:build', function () {
  return gulp.src(path.js)
    .pipe(uglify({outSourceMap: true}))
    .pipe(plumber({
      errorHandler: function (err) {
        console.log([
          'Errrroou!',
          '    Erro: ' + err.name + '',
          '  plugin: ' + err.plugin + '',
          'Mensagem: ' + err.message + '',
        ].join('\n'));
        this.emit('end');
      }
    }))
    .pipe(gulp.dest('build/assets/js/'));
});

gulp.task('move:build', function () {
  return gulp.src([
    'dev/**',
    '!dev/assets/less',
    '!dev/assets/less/**/*.less',
    '!dev/assets/js',
    '!dev/assets/js/**/*.js'
  ])
  .pipe(gulp.dest('build/'));
});

gulp.task('default', ['less', 'fileinclude', 'watch', 'sync']);
gulp.task('build', function () {
  runSequence('less', 'js:build', 'move:build');
});
