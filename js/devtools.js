(function (window) {
    "use strict";
    window.chrome.devtools.panels.create(
        'PHP Shell',
        'assets/php-logo.png',
        'components/shell.html'
    );
}(window));
