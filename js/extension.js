(function (window) {
    "use strict";
    var document = window.document;
    function PHPShell() {
        var setupEvent = document.createEvent('Event');
        this.xhr = new window.XMLHttpRequest();
        setupEvent.initEvent('setup', false, false);
        setupEvent.instance = this;
        document.dispatchEvent(setupEvent);
        return this;
    }
    PHPShell.prototype.host = 'https://php-minishell.appspot.com/';
    PHPShell.prototype.token = null;
    PHPShell.prototype.parse = function (statement) {
        var beforeParse = document.createEvent('Event');
        beforeParse.initEvent('beforeParse', false, false);
        beforeParse.token = this.token;
        beforeParse.statement = statement;
        document.dispatchEvent(beforeParse);
    };
    PHPShell.prototype.open = function (method, path) {
        this.xhr.open(method || 'get', this.host + (path || ''), true);
        this.xhr.send();
    };
    window.PHPShell = PHPShell;
}(window));
