var test = require('ava')
var fs = require('fs')
var path = require('path')
var svgCSSModules = require('../src/svg-css-modules-loader')

test('it should correctly transform source to css-modules', function (t) {
  var source = fs.readFileSync('./test.svg', 'utf8')
  var expected = require('./bundle')

  var module = {
    resourcePath: path.join(__dirname, 'test.svg'),
    getJSON: function () {},
    async: function () {
      return function (err, result) {
        if (err) {
          throw err
        }

        t.is(result, expected)
      }
    }
  }

  svgCSSModules.call(module, source)
})
