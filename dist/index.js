'use strict';

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _asciiTable = require('ascii-table');

var _asciiTable2 = _interopRequireDefault(_asciiTable);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _nodeWatch = require('node-watch');

var _nodeWatch2 = _interopRequireDefault(_nodeWatch);

var _promise = require('promise');

var _promise2 = _interopRequireDefault(_promise);

var _asciify = require('asciify');

var _asciify2 = _interopRequireDefault(_asciify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(0, _asciify2.default)('Translation Tool! v1.0', { font: 'eftitalic', color: 'yellow' }, function (err, res) {
  console.log(res);
});

var config = _path2.default.join(__dirname, '..', './config.json');

(function () {
  extractConfig(config).then(function (con) {
    //run once initially
    getFiles(con);
    //watch dir
    (0, _nodeWatch2.default)(con.src, { filter: /\.json$/ }, function () {
      return getFiles(con);
    });
  });
})();

function extractConfig(source) {
  return _fsExtra2.default.readFile(source, { encoding: 'utf-8' }).then(function (data) {
    return JSON.parse(data);
  }).catch(console.error);
}

function getFiles(source) {
  (0, _glob2.default)(source.src + '*.json', function (err, files) {
    var table = new _asciiTable2.default('results for ' + source.src).setHeading(['file'].concat(_toConsumableArray(source.keys)));
    var validations = files.map(function (file) {
      return validateFile(file, source.keys);
    });
    _promise2.default.all(validations).then(function (p) {
      p.map(function (v) {
        return table.addRow(v);
      });
      var message = table.toString();
      message = message.replace(/found/g, _chalk2.default.green('found'));
      message = message.replace(/missing/g, _chalk2.default.red('missing'));
      console.log(message);
    }).catch(console.error);
  });
}

function validateFile(file, keys) {
  return _fsExtra2.default.readFile(file, { encoding: 'utf-8' }).then(function (data) {
    return JSON.parse(data);
  }).then(function (obj) {
    return validateKeys(file, obj, keys);
  }).catch(console.error);
}

function validateKeys(file, obj, keys) {
  var missing = void 0;
  missing = keys.map(function (key) {
    return obj.hasOwnProperty(key) ? 'found' : 'missing';
  });
  return [file.split(_path2.default.sep).reduce(function (t, n) {
    return n;
  }, '')].concat(_toConsumableArray(missing));
}