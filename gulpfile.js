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
const browserify = require('browserify');
const babelify = require('babelify');
const optimizeImages = require('gulp-image');
const fs = require('fs');
const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');

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
  src(`${development.scss}/core.scss`)
    .pipe(sourceMaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoPrefixer({ cascade: false }))
    .pipe(sourceMaps.write('.'))
    .pipe(dest(production.css))
    .pipe(browserSync.reload({ stream: true }));
  done();
};

//---------------------------------------
//         SETUP JS TASK            ---
//---------------------------------------

const buildJS = (done) => {
  browserify({
    entries: [`${options.paths.src.js}/main.js`],
    transform: [babelify.configure({ presets: ['@babel/preset-env'] })],
  })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(dest(`${production}/js`))
    .pipe(browserSync.reload({ stream: true }));
  done();
};

//---------------------------------------
//      SETUP OPTIMIZE IMG TASK       ---
//---------------------------------------

const optimizeImages = (done) => {
  src(`${development.img}/**/*`)
    .pipe(optimizeImages())
    .pipe(dest(production.img));
  done();
};

//---------------------------------------
//          SETUP FONTS TASK          ---
//---------------------------------------

const fonts = (done) => {
  src(`${development.fonts}/**/*`)
    .pipe(dest(production.fonts))
    .pipe(browserSync.reload({ stream: true }));
  done();
};

//---------------------------------------
//             ASSETS TASK            ---
//---------------------------------------

const assets = () => {
  // BULMA
  const bulma = src(`${node_modules}bulma/*.sass`)
    .pipe(sass().on('Error', sass.logError))
    .pipe(dest(`${production.css}/assets/`));

  // FONTAWESOME
  const lineawesome_css = src(
    `${node_modules}line-awesome/dist/line-awesome/css/line-awesome.css`
  ).pipe(dest(`${production.fonts}/lineawesome/css`));

  //WEBFONTS DIR
  const webfonts = src(
    `${node_modules}line-awesome/dist/line-awesome/fonts/*`
  ).pipe(dest(`${production.fonts}/lineawesome/fonts`));

  //HTML5SHIV.JS
  const HTML5shiv = src(`${node_modules}html5shiv/dist/html5shiv.min.js`).pipe(
    dest(`${production.js}/assets`)
  );
  //RESPOND.JS
  const respond = src(`${node_modules}respond.js/dest/respond.min.js`).pipe(
    dest(`${production.js}/assets`)
  );

  return merge(bulma, lineawesome_css, webfonts, HTML5shiv, respond);
};

//-------------------------------------
//   PREVIEW MODE [ MINIFY FILES]   ---
//-------------------------------------

const previewMode = (done) => {
  if (fs.existsSync(options.paths.build)) {
    src(options.paths.build).pipe(clean({ force: true }));
  }

  // MINIFY HTML
  src(`${development}html/pages/**/*.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(options.paths.build));

  // MINIFY CSS
  src(`${development.scss}/core.scss`)
    .pipe(
      sass({
        outputStyle: 'compressed',
      }).on('error', sass.logError)
    )
    .pipe(
      autoPrefixer({
        cascade: false,
      })
    )
    .pipe(cleanCSS())
    .pipe(dest(options.paths.build.css));

  // BULMA
  src(`${node_modules}bulma/*.sass`)
    .pipe(
      sass({
        outputStyle: 'compressed',
      }).on('Error', sass.logError)
    )
    .pipe(cleanCSS())
    .pipe(dest(`${options.paths.build.css}/assets/`));

  // FONT AWESOME
  src(`${node_modules}line-awesome/dist/line-awesome/css/line-awesome.css`)
    .pipe(cleanCSS())
    .pipe(dest(`${options.paths.build.fonts}/fontawesome/css`));

  // MINIFY JS
  src(`${options.paths.src.js}/scripts/*.js`)
    .pipe(
      minify({
        ext: {
          min: '.js',
        },
        noSource: true,
      })
    )
    .pipe(dest(options.paths.build.js));

  // COMPRESS IMAGES
  src(`${options.paths.src.img}/*`)
    .pipe(images())
    .pipe(dest(options.paths.build.img));

  done();
};
