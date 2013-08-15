var process = require('./index').process;

module.exports = function(file) {
  return process(file, true);
};
