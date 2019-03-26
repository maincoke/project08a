const { series, parallel } = require('gulp');
const { exec } = require('child_process');

function runDataServer() {
  exec('cd server/user/session/shopper && rm -- !(LOCK)')
  exec('cd server && node start.js');
}

function runViewServer() {
  exec('ng serve --host 0.0.0.0 --port 3100');
}

exports.default = parallel(runDataServer);
