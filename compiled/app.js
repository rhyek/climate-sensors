'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

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
    var sensor, lastID;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _sqlite2.default.get('select * from sensors where serialNo = ?', [req.body.serialNo]);

          case 3:
            sensor = _context.sent;
            _context.next = 6;
            return _sqlite2.default.run('insert into readings (sensor_id, temperature, humidity) values (?, ?, ?)', [sensor.id, req.body.temp, req.body.hum]).then(function (s) {
              return s.lastID;
            });

          case 6:
            lastID = _context.sent;

            res.status(201).json({ id: lastID });
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](0);

            next(_context.t0);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 10]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

_bluebird2.default.resolve().then(function () {
  return _sqlite2.default.open('./db.sqlite', { verbose: true, Promise: _bluebird2.default });
}).then(function () {
  return _sqlite2.default.migrate();
}).catch(function (error) {
  return console.error(error.stack);
}).finally(function () {
  return app.listen(3000);
});