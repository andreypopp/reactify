var process = require('./index').process;

console.warn(
  'DEPRECATION WARNING: Transform reactify/undoubted is deprecated,\n' +
  ' pass -x option instead: browserify -t [ reactify -x coffee ] ...\n' +
  ' or via API: browserify(..).transform({extension: "coffee"}, reactify)'
);

module.exports = function(file) {
  return process(file, true);
};
