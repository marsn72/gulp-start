const { src, dest, parallel, series, watch } = require('gulp');

const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const rename = require('gulp-rename');

const sourcemap = require('gulp-sourcemaps');
const scss = require('gulp-sass');
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

function clean() {
  return del('dist');
}

function html() {
  return src(path.src.html)
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream());
}

function scripts() {
  return src(path.src.js)
    .pipe(webpack({
      mode: 'production',
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
              presets: ['@babel/env']
            }
          }
        ]
      }
    })).on('error', function handleError() {
      this.emit('end');
    })
    .pipe(rename('main.min.js'))
    //.pipe(uglify())
    .pipe(dest(path.build.js))
    .pipe(browserSync.stream());
}

function styles() {
  return src(path.src.css)
    .pipe(sourcemap.init())
    .pipe(scss({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    }))
    .pipe(concat('style.min.css'))
    .pipe(sourcemap.write('./'))
    .pipe(dest(path.build.css))
    .pipe(browserSync.stream());
}

function images() {
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

function fonts() {
  return src(path.src.fonts)
    .pipe(dest(path.build.fonts));
}

function watching() {
  watch(path.src.html, html);
  watch(path.src.js, scripts);
  watch(path.src.css, styles);
  watch(path.src.img, images);
  watch(path.src.html).on('change', browserSync.reload);
}

exports.browsersync = browsersync;
exports.html = html;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.fonts = fonts;

exports.default = series(clean, parallel(html, scripts, styles, images, fonts, browsersync, watching));