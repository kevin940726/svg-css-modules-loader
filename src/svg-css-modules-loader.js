'use-strict'

var cheerio = require('cheerio')
var genericNames = require('generic-names')
var postcss = require('postcss')
var postcssModules = require('postcss-modules')
var loaderUtils = require('loader-utils')

var defaultLocalIndentName = '[name]__[local]___[hash:base64:5]'

module.exports = function (source) {
  this.cacheable && this.cacheable()
  var callback = this.async()
  var path = this.resourcePath
  var query = loaderUtils.getOptions(this) || {}

  var localIdentName = query.localIdentName || defaultLocalIndentName
  var transformId = query.transformId || false

  var generate = genericNames(localIdentName, {
    context: process.cwd()
  })

  var postcssModulesProcessor = postcss([
    postcssModules({
      generateScopedName: localIdentName,
      getJSON: function () {}
    })
  ])

  var $ = cheerio.load(source, {
    xmlMode: true,
    lowerCaseAttributeNames: false
  })

  // transform classes
  $('*[class]:not(svg)').attr('class', function () {
    return $(this).attr('class')
      .split(' ')
      .map(function (c) {
        return generate(c, path)
      })
      .join(' ')
  })

  postcssModulesProcessor
    .process($('style').text(), { from: path, to: path })
    .then(function (result) {
      $('style').text(result.css)
      var xml = $.xml()

      // transform id
      if (transformId) {
        // id attribute
        $('*[id]:not(svg)').attr('id', function () {
          return generate($(this).attr('id'), path)
        })
        xml = $.xml()

        // url value, e.g. `url(#id)`
        var urlIDRegex = /url\((['"]?)#([\w-_]+)\1\)/g
        xml = xml.replace(urlIDRegex, function (match, p1, p2) {
          return 'url(' + p1 + '#' + generate(p2, path) + p1 + ')'
        })

        // xlink attribute, e.g. `xlink:href="#id"`
        var xlinkRegex = /xlink:href=(['"])#([\w-_]+)\1/g
        xml = xml.replace(xlinkRegex, function (match, p1, p2) {
          return 'xlink:href=' + p1 + '#' + generate(p2, path) + p1
        })
      }

      callback(null, xml)
    })
    .catch(function (err) {
      callback(err)
    })
}
