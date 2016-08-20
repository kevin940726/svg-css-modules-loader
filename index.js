var css = require('css')
var shortid = require('shortid')

exports.type = 'perItem'

exports.active = true

// generate a short hash id without duplicate
var prefix = shortid.generate()

exports.fn = function (item) {
  if (item.elem) {
    if (item.isElem('svg')) {
      // add prefix to svg class
      if (item.hasAttr('class')) {
        var classes = item.attr('class').value.split(' ')
        if (classes.indexOf(prefix) < 0) {
          classes.push(prefix)
        }
        item.attr('class').value = classes.join(' ')
      } else {
        item.addAttr({
          name: 'class',
          value: prefix,
          prefix: '',
          local: 'class'
        })
      }
    } else if (item.isElem('style') && !item.isEmpty()) {
      // prefix every selector with prefix
      var styleCss = item.content[0].text || item.content[0].cdata || []
      var DATA = styleCss.indexOf('>') >= 0 || styleCss.indexOf('<') >= 0 ? 'cdata' : 'text'

      if (styleCss.length) {
        var AST = css.parse(styleCss)
        if (AST.stylesheet && AST.stylesheet.rules) {
          AST.stylesheet.rules.forEach(function (rule) {
            if (rule.type === 'rule' && rule.selectors) {
              rule.selectors = rule.selectors.map(function (selector) {
                return '.' + prefix + selector
              })
            }
          })
        }

        item.content[0][DATA] = css.stringify(AST, {
          indent: '',
          compress: true
        })
      }
    }
  }

  return item
}
