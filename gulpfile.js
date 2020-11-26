const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');

const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const less = require('gulp-less');
const stylus = require('gulp-stylus');

const project_folder = 'dist';
const source_folder = '#src';

const fs = require('fs');

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
    js: source_folder + '/js/main.js',
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

function browsersync() {
  browserSync.init({
    server: {
      baseDir: './' + project_folder + '/',
    },
    port: 4000,
    notify: false,
    online: true
  });
};

function html () {
  return src(path.src.html)
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream());
}

function scripts() {
  return src(path.src.js)
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream());
}

function styles () {
  return src(path.src.css)
    .pipe(sourcemap.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemap.write('./'))
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream());
}

function images () {
  return src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      interlaced: true,
      optimizationLevel: 3
    }))
    .pipe(dest(path.build.img))
    .pipe(browserSync.stream());
}

function startwatch() {
  watch(path.src.html, html);
  watch([path.src.js, '!#src/js/**/*.min.js'], scripts);
  watch([path.src.css, '!#src/css/**/*.min.css'], styles);
  watch(path.src.img, images);
  watch(path.src.html).on('change', browserSync.reload);
}

exports.browsersync = browsersync;
exports.html = html;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;

exports.default = parallel(html, scripts, styles, browsersync, startwatch);