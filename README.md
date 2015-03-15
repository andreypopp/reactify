# reactify

[Browserify][] transform for JSX (superset of JavaScript used in [React][]
library):

    var React = require('react')

    class Hello extends React.Component {

      render() {
        return <div>Hello, {this.props.name}!</div>
      }
    }

Save the snippet above as `main.js` and then produce a bundle with the following
command:

    % browserify -t reactify main.js

`reactify` transform activates for files with either `.js` or `.jsx` extensions.

If you want to reactify modules with other extensions, pass an `-x /
--extension` option:

    % browserify -t coffeeify -t [ reactify --extension coffee ] main.coffee

If you don't want to specify extension, just pass `--everything` option:

    % browserify -t coffeeify -t [ reactify --everything ] main.coffee

## ES6 transformation

`reactify` transform also can compile a limited set of es6 syntax constructs
into es5. Supported features are arrow functions, rest params, templates, object
short notation and classes. You can activate this via `--es6` or `--harmony`
boolean option:

    % browserify -t [ reactify --es6 ] main.js

the `--target es3` will avoid uses of `defineProperty` and quote reserved words:

    % browserify -t [ reactify --es6 --target es3 ] main.js

You can also configure it in package.json

```json
{
    "name": "my-package",
    "browserify": {
        "transform": [
            ["reactify", {"es6": true}]
        ]
    }
}
```

[Browserify]: http://browserify.org
[React]: http://facebook.github.io/react/
