[Browserify][] transform for `text/jsx` (superset of JavaScript used in
[React][] library).

Basic usage is:

    % browserify -t reactify main.js

`reactify` transform activates for files with either `.jsx` extension or `/**
@jsx React.DOM */` pragma as a first line for any `.js` file.

If you want to reactify modules with other extensions, pass an `-x / --extension`
option:

    % browserify -t coffeeify -t [ reactify --extension coffee ] main.coffee

[Browserify]: http://browserify.org
[React]: http://facebook.github.io/react/
