var gulp        = require('gulp'),
    stylus      = require('gulp-stylus'),
    jeet        = require('jeet'),
    rupture     = require('rupture'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    uglify      = require('gulp-uglify'),
    concat      = require('gulp-concat'),
    changed     = require('gulp-changed'),
    runSequence = require('run-sequence'),
    plumber     = require('gulp-plumber'),
    spritesmith = require('gulp.spritesmith');

var path = {
  js: ['dev/assets/js/**/*.js', '!dev/assets/js/**/*.min.js'],
  stylus: ['dev/assets/stylus/**/*.styl'],
  css: ['dev/assets/css/**/*.css', '!dev/assets/css/**/*.min.css'],
  img: ['dev/assets/img/**/*'],
  html: ['dev/**/*.html']
};

gulp.task('sprite', function () {
  var spriteData = gulp.src('assets/img/partials/*.png')
  .pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));
  return spriteData.pipe(gulp.dest('assets/img/'));
});

gulp.task('stylus', function () {
  return gulp.src(path.stylus)
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
    .pipe(stylus({
      compress: true,
      use: [jeet(), rupture()]
    }))
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

gulp.task('html', function () {
  return gulp.src(path.html)
    .pipe(reload({stream:true}));
});

gulp.task('watch', function () {
  gulp.watch(path.stylus, ['stylus']);
  gulp.watch(path.html, ['html']);
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
    '!dev/assets/stylus',
    '!dev/assets/stylus/**/*.styl',
    '!dev/assets/js',
    '!dev/assets/js/**/*.js'
  ])
  .pipe(gulp.dest('build/'));
});

gulp.task('default', ['stylus', 'watch', 'sync']);
gulp.task('build', function () {
  runSequence('stylus', 'js:build', 'move:build');
});
