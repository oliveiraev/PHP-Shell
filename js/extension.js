(function (window) {
    "use strict";
    function PHPShell() {
        this.xhr = new window.XMLHttpRequest();
        this.xhr.onreadystatechange = this.xhrReadyStateChange(this);
    }
    PHPShell.prototype.xhr = null;
    PHPShell.prototype.onXhrLoaded = null;
    PHPShell.prototype.host = 'https://php-minishell.appspot.com/';
    PHPShell.prototype.open = function (method, path) {
        this.xhr.open(method || 'get', this.host + (path || ''), true);
        this.xhr.send();
    };
    PHPShell.prototype.xhrReadyStateChange = function (instance) {
        return function () {
            if (instance.xhr.readyState === 4) {
                instance.onXhrLoaded(instance);
            }
        };
    };
    window.PHPShell = new PHPShell();
}(window));
