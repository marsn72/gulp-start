let gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename');

let project_folder = 'dist';
let source_folder = '#src';

let fs = require('fs');

let path = {
  build: {
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/js/',
    img: project_folder + '/img/',
    fonts: project_folder + '/fonts/',
  },
  src: {
    html: [source_folder + '/*.html', source_folder + '/templates/*.html', '!' + source_folder + '/templates/_*.html'],
    css: source_folder + '/scss/**/*.scss',
    js: source_folder + '/js/app.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
    fonts: source_folder + '/fonts/*.ttf',
  },
  watch: {
    html: source_folder + '/**/*.html',
    css: source_folder + '/scss/**/*.scss',
    js: source_folder + '/js/**/*.js',
    img: source_folder + '/img/**/*/{jpg,png,svg,gif,ico,webp}',
  },
  clean: './' + project_folder + '/'
}

gulp.task('html', function () {
  return gulp.src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.stream());
});

gulp.task('scss', function () {
  return gulp.src(path.src.css)
    .pipe(sass({
      outputStyle: "compressed"
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
});

gulp.task('script', function () {
  return gulp.src(path.src.js)
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
});

gulp.task('js', function () {
  return gulp.src([
    'node_modules/slick-carousel/slick/slick.js',
    'node_modules/magnific-popup/dist/jquery.magnific-popup.js'
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
});

gulp.task('img', function () {
  return gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      interlaced: true,
      optimizationLevel: 3
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(browserSync.stream());
})

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: './' + project_folder + '/',
    },
    port: 4000,
    notify: false
  });
});

gulp.task('watch', function () {
  gulp.watch(path.src.css, gulp.parallel('scss'));
  gulp.watch(path.src.html, gulp.parallel('html'));
  gulp.watch(path.src.js, gulp.parallel('script'));
  gulp.watch(path.src.img, gulp.parallel('img'));
});

gulp.task('default', gulp.parallel('browser-sync', 'watch', 'html', 'scss', 'js', 'img', 'script'));




