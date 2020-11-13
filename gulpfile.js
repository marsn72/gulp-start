let gulp = require('gulp'),
  sass = require('gulp-sass');

let project_folder = 'dist';
let source_folder = '#src';

  let path = {
    build: {
      html: project_folder + '/',
      css: project_folder + '/css/',
      js: project_folder + '/js/',
      img: project_folder + '/img/',
      fonts: project_folder + '/fonts/',
     },
    src: {
      // html: [source_folder + '/templates/*.html', '!' + source_folder + '/templates/_*.html'],
      css: source_folder + '/scss/**/*.scss',
      // js: source_folder + '/js/app.js',
      // img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
      // fonts: source_folder + '/fonts/*.ttf',
    },
    watch: {
      html: source_folder + '/**/*.html',
      css: source_folder + '/scss/**/*.scss',
      js: source_folder + '/js/**/*.js',
      img: source_folder + '/img/**/*/{jpg,png,svg,gif,ico,webp}',
    },
    clean: './' + project_folder + '/'
  }  

gulp.task('scss', function () {
  return gulp.src(path.src.css)
    .pipe(sass({
      outputStyle: "expanded"
    }))
    .pipe(gulp.dest(path.build.css));
});

gulp.task('watch', function(){
  gulp.watch(path.src.css, gulp.parallel('scss'));
});
