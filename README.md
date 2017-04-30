# svg-css-modules-loader
Webpack loader to transform svg css modules.

[![NPM](https://nodei.co/npm/svg-css-modules-loader.png?downloads=true&stars=true)](https://nodei.co/npm/svg-css-modules-loader/)

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Motivation
Inline svg is awesome, it let you control your svg with css on the fly. Using a loader like `svg-react-loader` let you quickly import your svg as inline React component. But what happen if your svg file has some css style in it? This is a very common thing when you are exporting svg from **sketch** or other application. Now importing multiple svg files will cause some class name collision issues, and it is a pain in the ass. So, css modules to the rescue.

**tl;dr**
```html
/* from ... */
/* file.svg */
<svg>
  <defs><style>
  .class {
    fill: #fff;
  }
  </style></defs>
  <path class="class" />
</svg>

/* ... to */
<svg>
  <defs><style>
  .file__class___DhpID {
    fill: #fff;
  }
  </style></defs>
  <path class="file__class___DhpID" />
</svg>
```

## Installation
```bash
$ yarn add -D svg-css-modules-loader
$ npm install --save-dev svg-css-modules-loader
```

## Usage
(webpack 1)

Load the loader before the [svg-react-loader](https://github.com/jhamlet/svg-react-loader) or other loader like below.
```js
loaders: [
  //... other loaders
  {
    test: /\.svg$/,
    loader: 'svg-react!svg-css-modules?transformId'
  },
  //... other loaders
]
```

It's also highly recommended to include [svgo](https://github.com/svg/svgo) in your loaders by using [svgo-loader](https://github.com/rpominov/svgo-loader) or [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader)

```js
loader: 'svg-react!svgo!svg-css-modules'
```

## Options

#### `localIdentName`: string

What indent name should loader transform to, more info [here](https://github.com/webpack/loader-utils#interpolatename). Default to `[name]__[local]___[hash:base64:5]`.

#### `transformId`: boolean

Whether to enable id transformation. default to false.

## Author

Kai Hao

## License

MIT
