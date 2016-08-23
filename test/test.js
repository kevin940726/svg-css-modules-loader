import test from 'ava'
import fs from 'fs'
import path from 'path'
import svgCSSModules from '../src/svg-css-modules-loader'
import genericNames from 'generic-names'

const generate = genericNames('[name]__[local]___[hash:base64:5]', {
  context: process.cwd()
})

const PATH = path.join(__dirname, 'test.svg')

const callTest = (t) => (source, expected) => {
  const module = {
    resourcePath: PATH,
    async: () => (err, result) => {
      if (err) {
        throw err
      }

      t.is(result, expected)
    }
  }

  svgCSSModules.call(module, source)
}

test('it should correctly transform source to css-modules', t => {
  const source = fs.readFileSync('./test.svg', 'utf8')
  const expected = require('./bundle')

  callTest(t)(source, expected)
})

test('it should handle camelCase attributes and tags in xmlMode', t => {
  const source = '<svg viewBox="0 0 100 100"><clipPath></clipPath></svg>'
  const expected = source

  callTest(t)(source, expected)
})

test('it should transform id to css-modules', t => {
  const id = 'a'
  const expectedId = generate(id, PATH)
  const source = '<svg><defs><style>#a{fill:none;}</style></defs><path id="a"/></svg>'
  const expected = `<svg><defs><style>#${expectedId}{fill:none;}</style></defs><path id="${expectedId}"/></svg>`

  callTest(t)(source, expected)
})

{
  const macro = (t, input, expect) => callTest(t)(input, expect)
  macro.title = (providedTitle, input) => `it should also transform id in url to css-modules with(out) quotes ${input}`
  const id = 'a'
  const expectedId = generate(id, PATH)
  const quotes = ['', '\'', '"']
  quotes.forEach(quote => {
    const source = `<svg><defs><style>path{clip-path:url(${quote}#${id}${quote});}</style></defs><path/></svg>`
    const expected = `<svg><defs><style>path{clip-path:url(${quote}#${expectedId}${quote});}</style></defs><path/></svg>`
    test(macro, source, expected)
  })
}
