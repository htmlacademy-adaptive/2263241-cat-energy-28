import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgmin from 'gulp-svgmin';
import { stacksvg } from "gulp-stacksvg"
import {deleteAsync} from 'del';
import browser from 'browser-sync';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe (rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//Html

const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'))
}

//Scripts
const scripts =() => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'))
}

//Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'))
}

const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}','!source/img/favicons')
  .pipe(squoosh({webp:{}}))
  .pipe(gulp.dest('build/img'))
}

//SVG
const svg = () => {
  return gulp.src('source/img/*.svg')
  .pipe(svgmin())
  .pipe(gulp.dest('build/img'))
}

const stack = () => {
  return gulp.src('source/img/icons/*.svg')
  .pipe(svgmin())
  .pipe(stacksvg())
  .pipe(gulp.dest('build/img'))
}

//copy
const copy = (done) => {
  gulp.src([
  'source/fonts/**/*.{woff2,woff}',
  'source/*.ico',
  'source/img/favicons/*.*',
  'source/*.webmanifest'
  ], { base: "source"})
  .pipe(gulp.dest('build'))
  done();
}

//clean
const clean = () => {
  return deleteAsync('build');
}


// Servers

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

//reload
const reload = (done) => {
  browser.reload()
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

export const build = gulp.series(
  clean,
  gulp.parallel(
    html,
    styles,
    scripts,
    stack,
    svg,
    copy,
    optimizeImages,
    createWebp
  ),
);

export default gulp.series(
  clean,
  gulp.parallel(
    html,
    styles,
    scripts,
    stack,
    svg,
    copy,
    copyImages,
    createWebp
  ),
  server,
  watcher
);
