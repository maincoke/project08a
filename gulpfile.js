const { series, parallel } = require('gulp');
const del = require('del');
const exec = require('child_process').exec;
const srcSession = 'server/user/session/shopper/';

function sessionCleaner() {
  return del([srcSession + '*', '!' + srcSession + 'LOCK']);
}

function runDataServer() {
  return exec('cd server && node start.js');
}

function runViewServer() {
  return exec('npm run start');
}

exports.default = parallel(series(sessionCleaner, runDataServer), runViewServer);
