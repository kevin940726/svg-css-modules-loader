'use-strict'

var cheerio = require('cheerio')
var genericNames = require('generic-names')
var postcss = require('postcss')
var postcssModules = require('postcss-modules')
var postcssUrl = require('postcss-url')
var parseQuery = require('webpack-parse-query')

var defaultLocalIndentName = '[name]__[local]___[hash:base64:5]'

module.exports = function (source) {
  this.cacheable && this.cacheable()
  var callback = this.async()
  var path = this.resourcePath
  var query = parseQuery(this.query)

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

  var postcssUrlProcessor = postcss([
    postcssUrl({
      url: function (url) {
        var regex = /^#(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)$/g
        var match = regex.exec(url)
        if (match && match.length) {
          return '#' + generate(match[1], path)
        }
        return url
      }
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

  // transform id
  if (transformId) {
    $('*[id]:not(svg)').attr('id', function () {
      return generate($(this).attr('id'), path)
    })
  }

  postcssModulesProcessor
    .process($('style').text(), { from: path, to: path })
    .then(function (result) {
      return postcssUrlProcessor.process(result.css, { from: path, to: path })
    })
    .then(function (result) {
      $('style').text(result.css)

      callback(null, $.xml())
    })
    .catch(function (err) {
      callback(err)
    })
}
