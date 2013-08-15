[Browserify][] v2 transform for `text/jsx` (superset of JavaScript used in [React][] library).

Basic usage is:

    % browserify -t reactify main.jsx

`reactify` transform activates for files with either `.jsx` extension or `/**
@jsx React.DOM */` pragma as a first line for any `.js` file. If you want it to
be activated for any file, use:

    % browserify -t reactify/undoubted main.anyext

[Browserify]: http://browserify.org
[React]: http://facebook.github.io/react/
