var test = require('ava')
var SVGO = require('svgo')
var svgoPluginCSSModules = require('../')
var svg2js = require('svgo/lib/svgo/svg2js')

var svgo = new SVGO({
  plugins: [{
    svgoPluginCSSModules: svgoPluginCSSModules
  }]
})

test('it should correctly add prefix class name to svg style', function (t) {
  t.plan(2)
  var svg = '<svg><defs><style>.a{fill:#fff;}</style></defs></svg>'
  svgo.optimize(svg, function (result) {
    svg2js(result.data, function (root) {
      var className = root.content[0].attrs.class.value
      t.truthy(className)
      t.is(
        root.content[0].content[0].content[0].content[0].text,
        '.' + className + ' .a{fill:#fff;}'
      )
    })
  })
})
