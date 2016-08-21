import test from 'ava'
import fs from 'fs'
import path from 'path'
import svgCSSModules from '../src/svg-css-modules-loader'

test('it should correctly transform source to css-modules', t => {
  const source = fs.readFileSync('./test.svg', 'utf8')
  const expected = require('./bundle')

  const module = {
    resourcePath: path.join(__dirname, 'test.svg'),
    async: () => (err, result) => {
      if (err) {
        throw err
      }

      t.is(result, expected)
    }
  }

  svgCSSModules.call(module, source)
})

test('it should handle camelCase attributes and tags in xmlMode', t => {
  const source = '<svg viewBox="0 0 100 100"><clipPath></clipPath></svg>'
  const expected = source

  const module = {
    resourcePath: path.join(__dirname, 'test.svg'),
    async: () => (err, result) => {
      if (err) {
        throw err
      }

      t.is(result, expected)
    }
  }

  svgCSSModules.call(module, source)
})
