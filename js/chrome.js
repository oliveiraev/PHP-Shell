(function (window) {
    "use strict";
    var document, PHPShell;
    document = window.document;
    PHPShell = window.PHPShell;
    function setup(instance) {
        return function (response) {
            var data = document.createElement('div');
            data.style.display = 'none';
            data.innerHTML = response.xhr.responseText;
            document.body.appendChild(data);
            instance.token = document.getElementsByName('token')[0].value;
            document.body.removeChild(data);
        };
    }
    function getMessage(instance) {
        return function (message, sender, callback) {
            instance.onXhrLoaded = callback;
            instance.open(message.method, message.path);
            return true;
        };
    }
    window.chrome.runtime.onMessage.addListener(getMessage(new PHPShell()));
    function sendMessage(message, callback) {
        window.chrome.runtime.sendMessage(message, callback);
    }
    PHPShell.prototype.setup = function () {
        sendMessage({path: this.host}, setup(this));
    };
    PHPShell.prototype.parse = function (statement, callback) {
        var message = {
            path: 'shell.do?token=' + this.token + '&statement=' + statement
        };
        sendMessage(message, callback);
    };
    // IDE helper
    //noinspection JSUnresolvedVariable
    window.chrome = window.chrome || {
        devtools: {
            panels: {
                create: null
            }
        },
        runtime: {
            onMessage: {
                addListener: null
            },
            sendMessage: null
        }
    };
}(window));
