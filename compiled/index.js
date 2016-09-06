'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _sqlite = require('sqlite');

var _sqlite2 = _interopRequireDefault(_sqlite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use(_bodyParser2.default.json());

app.get('/', function (req, res) {
  res.send('Hello world!');
});

app.post('/readings', function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next) {
    var _ref2, _ref3, sensors, sensor;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log(req.body);
            _context.prev = 1;
            _context.next = 4;
            return _bluebird2.default.all([_sqlite2.default.all('select * from sensors').then(function (ss) {
              console.log(ss);
              return ss;
            })]);

          case 4:
            _ref2 = _context.sent;
            _ref3 = (0, _slicedToArray3.default)(_ref2, 1);
            sensors = _ref3[0];

            console.log(sensors);
            _context.next = 10;
            return _sqlite2.default.get('select * from sensors where serialNo = ?', [req.body.serialNo]);

          case 10:
            sensor = _context.sent;

            console.log(sensor);
            _context.next = 14;
            return _sqlite2.default.run('insert into reading (sensor_id, temperature, humidity) values (?, ?, ?)', [sensor.id, req.temp, req.hum]);

          case 14:
            res.end();
            _context.next = 20;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context['catch'](1);

            next(_context.t0);

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 17]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

_bluebird2.default.resolve().then(function () {
  return _sqlite2.default.open('./db.sqlite', { Promise: _bluebird2.default });
}).then(function () {
  return _sqlite2.default.migrate();
}).catch(function (error) {
  return console.error(error.stack);
}).finally(function () {
  return app.listen(3000);
});