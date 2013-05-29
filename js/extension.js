(function (window) {
    "use strict";
    function xhrListener(instance) {
        return function () {
            if (instance.xhr.readyState === 4) {
                instance.onXhrLoaded(instance);
            }
        };
    }
    function PHPShell() {
        this.xhr = new window.XMLHttpRequest();
        this.xhr.addEventListener('readystatechange', xhrListener(this));
        this.setup();
        return this;
    }
    PHPShell.prototype.host = 'https://php-minishell.appspot.com/';
    PHPShell.prototype.token = null;
    PHPShell.prototype.setup = function () {};
    PHPShell.prototype.onXhrLoaded = function (PHPShell) {};
    PHPShell.prototype.parse = function (statement, callback) {};
    PHPShell.prototype.open = function (method, path) {
        this.xhr.open(method || 'get', this.host + (path || ''), true);
        this.xhr.send();
    };
    window.PHPShell = PHPShell;
}(window));
