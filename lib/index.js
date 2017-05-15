'use strict';

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = _path2.default.join(__dirname, '..', 'config.json');

var source = void 0;
var keys = [];

_fsExtra2.default.readFile(config, { encoding: 'utf-8' }).then(function (data) {
  keys = getKeys(data);
  source = getSource(data);
  console.log('keys', keys);
  console.log('source', source);
}).catch(function (err) {
  return console.log(err);
});

function getSource() {
  var json = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var _json = JSON.parse(json);
  var source = '';

  if (_json['src']) {
    source = _json['src'];
  }

  return source;
}

function getKeys() {
  var json = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var _json = JSON.parse(json);
  var keys = [];
  if (_json['keys']) {
    keys = _json['keys'];
  }

  return keys;
}