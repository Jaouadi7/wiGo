//---------------------------------------
//        INSTALLED NPM PLUGINS       ---
//---------------------------------------

const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const panini = require('panini');
const sassCompiler = require('sass');
const gulpSass = require('gulp-sass');
const autoPrefixer = require('gulp-autoprefixer');
const sourceMaps = require('gulp-sourcemaps');

const sass = gulpSass(sassCompiler);
import options from './config';

//---------------------------------------
//     SETUP THE PROJECT ROUTES       ---
//---------------------------------------

const development = options.paths.src.base;
const production = options.paths.dist.base;
const node_modules = './node_modules/';

//----------------------------------------------
//     SETUP THE PROJECT STATIC SERVER       ---
//----------------------------------------------

// START THE DEVELOPEMNT STATIC SERVER
const start_server = (done) => {
  browserSync.init({
    server: {
      baseDir: production,
    },
    port: options.config.port || 5000,
  });
};

// RELOAD THE BROWSER
const reload = (done) => {
  browserSync.reload;
  done();
};

//---------------------------------------
//         SETUP HTML TASK            ---
//---------------------------------------

const buildHTML = (done) => {
  panini.refresh();
  src(`${development}html/pages/**/*.html`)
    .pipe(
      panini({
        root: `${development}html/pages/`,
        layouts: `${development}html/layouts/`,
        partials: `${development}html/partials/`,
        helpers: `${development}html/helpers/`,
        data: `${development}html/data/`,
      })
    )
    .pipe(dest(production))
    .pipe(browserSync.reload({ stream: true }));
  done();
};

//---------------------------------------
//         SETUP CSS TASK            ---
//---------------------------------------

const buildCSS = (done) => {
  src(`${development}scss/core.scss`)
    .pipe(sourceMaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoPrefixer({ cascade: false }))
    .pipe(sourceMaps.write('.'))
    .pipe(dest(`${production}css/`))
    .pipe(browserSync.reload({ stream: true }));
  done();
};
