//---------------------------------------
//        INSTALLED NPM PLUGINS       ---
//---------------------------------------

const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
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
