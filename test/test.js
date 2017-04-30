import test from 'ava'
import fs from 'fs'
import path from 'path'
import svgCSSModules from '../src/svg-css-modules-loader'
import genericNames from 'generic-names'

const generate = genericNames('[name]__[local]___[hash:base64:5]', {
  context: process.cwd()
})

const PATH = path.join(__dirname, 'test.svg')

const transform = (source, options) => {
  return new Promise((resolve, reject) => {
    const module = Object.assign(
      {},
      {
        resourcePath: PATH,
        async: () => (err, result) => {
          if (err) {
            reject(err)
          }

          resolve(result)
        }
      },
      options
    )

    svgCSSModules.call(module, source)
  })
}

test('it should correctly transform source to css-modules', t => {
  const expected = fs.readFileSync('./result.svg', 'utf8')

  t.truthy(expected)
})

test('it should handle camelCase attributes and tags in xmlMode', async t => {
  const source = '<svg viewBox="0 0 100 100"><clipPath></clipPath></svg>'
  const expected = '<svg viewBox="0 0 100 100"><clipPath/></svg>'

  const result = await transform(source)
  t.is(result, expected)
})

test('it should transform id to css-modules', async t => {
  const id = 'a'
  const expectedId = generate(id, PATH)
  const source = '<svg><defs><style>#a{fill:none;}</style></defs><path id="a"/></svg>'
  const expected = `<svg><defs><style>#${expectedId}{fill:none;}</style></defs><path id="${expectedId}"/></svg>`

  const result = await transform(source, {
    query: '?transformId'
  })
  t.is(result, expected)
})

{
  const macro = (t, input, expect) => t.is(input, expect)
  macro.title = (providedTitle, input) => `it should also transform id in url to css-modules with(out) quotes ${input}`
  const id = 'a'
  const expectedId = generate(id, PATH)
  const quotes = ['', '\'', '"']
  quotes.forEach(async quote => {
    const source = `<svg><defs><style>path{clip-path:url(${quote}#${id}${quote});}</style></defs><path/></svg>`
    const expected = `<svg><defs><style>path{clip-path:url(${quote}#${expectedId}${quote});}</style></defs><path/></svg>`

    const result = await transform(source, {
      query: '?transformId'
    })
    test(macro, result, expected)
  })
}

test('it should transform id in "xlink:href"', async t => {
  const id = 'a'
  const expectedId = generate(id, PATH)
  const source = `<svg><g id="${id}"><use xlink:href="#${id}"/></g></svg>`
  const expected = `<svg><g id="${expectedId}"><use xlink:href="#${expectedId}"/></g></svg>`

  const result = await transform(source, {
    query: '?transformId'
  })
  t.is(result, expected)
})

test('it should transform id to css-modules in url attributes', async t => {
  const id = 'a'
  const expectedId = generate(id, PATH)
  const source = `<svg><defs><linearGradient id="${id}"/></defs><path stroke="url(#${id})"/></svg>`
  const expected = `<svg><defs><linearGradient id="${expectedId}"/></defs><path stroke="url(#${expectedId})"/></svg>`

  const result = await transform(source, {
    query: '?transformId'
  })
  t.is(result, expected)
})
