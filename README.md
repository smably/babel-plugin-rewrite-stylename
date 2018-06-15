# babel-plugin-rewrite-stylename

Transforms `styleName` to `className`.

Helps create stable snapshots when using [`babel-plugin-react-css-modules`](https://github.com/gajus/babel-plugin-react-css-modules). `styleName` will be rewritten to `className` (and if a `className` already exists, they will be merged). Add it to your `.babelrc` like so:
```json
{
  "env": {
    "test": {
      "plugins": ["rewrite-stylename"]
    }
  }
}
```
