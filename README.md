[Browserify][] transform for JSX (superset of JavaScript used in [React][]
library).

Basic usage is:

    % browserify -t reactify main.js

`reactify` transform activates for files with either `.jsx` extension or `/**
@jsx React.DOM */` pragma as a first line for any `.js` file.

`reactify` transform also can compile a limited set of es6 syntax constructs
into es5. Supported features are arrow functions, rest params, templates, object
short notation and classes. You can activate this via `--es6` or `--harmony`
boolean option:

    % browserify -t [ reactify --es6 ] main.js

If you want to reactify modules with other extensions, pass an `-x /
--extension` option:

    % browserify -t coffeeify -t [ reactify --extension coffee ] main.coffee

If you don't want to specify extension, just pass `--everything` option:

    % browserify -t coffeeify -t [ reactify --everything ] main.coffee

[Browserify]: http://browserify.org
[React]: http://facebook.github.io/react/
