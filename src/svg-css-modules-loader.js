'use-strict'

var cheerio = require('cheerio')
var genericNames = require('generic-names')
var postcss = require('postcss')
var postcssModules = require('postcss-modules')

var generate = genericNames('[name]__[local]___[hash:base64:5]', {
  context: process.cwd()
})

var cssProcessor = postcss([
  postcssModules({
    generateScopedName: '[name]__[local]___[hash:base64:5]',
    getJSON: function () {}
  })
])

module.exports = function (source) {
  var callback = this.async()
  var path = this.resourcePath

  var $ = cheerio.load(source)

  $('*[class]:not(svg)').attr('class', function () {
    return $(this).attr('class')
      .split(' ')
      .map(function (c) {
        return generate(c, path)
      })
      .join(' ')
  })

  cssProcessor.process($('style').text(), { from: path, to: path })
    .then(function (result) {
      $('style').text(result.css)

      callback(null, $.html())
    })
    .catch(function (err) {
      callback(err)
    })
}
