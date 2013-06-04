(function (window) {
    "use strict";
    var document, PHPShell;
    document = window.document;
    PHPShell = new window.PHPShell();
    function afterParseDispatcher(response) {
        var parseEvent = document.createEvent('Event');
        parseEvent.initEvent('parse', false, false);
        parseEvent.response = response.xhr.responseText;
        document.dispatchEvent(parseEvent);
    }
    function beforeParseListener(event) {
        var path, message;
        path = 'shell.do?token=' + event.token + '&statement=';
        message = {path: path + event.statement};
        window.chrome.runtime.sendMessage(message, afterParseDispatcher);
    }
    function xhrListen(loadedCallback) {
        return function () {
            if (!loadedCallback.sender) {
                return;
            }
            if (PHPShell.xhr.readyState === 4) {
                loadedCallback.sender = null;
                loadedCallback(PHPShell);
            }
        };
    }
    function messageListener(message, sender, callback) {
        callback.sender = sender;
        PHPShell.xhr.addEventListener('readystatechange', xhrListen(callback));
        PHPShell.open(message.method, message.path);
        return true;
    }
    function setupListener(event) {
        function setup(response) {
            var data, html;
            data = new RegExp('(<form[\\s\\S]*</form>)', 'mg');
            html = document.createElement('div');
            html.innerHTML = data.exec(response.xhr.responseText)[1];
            event.instance.token = html.querySelector('[name=token]').value;
        }
        window.chrome.runtime.sendMessage({}, setup);
    }
    window.chrome.runtime.onMessage.addListener(messageListener);
    document.addEventListener('beforeParse', beforeParseListener);
    document.addEventListener('setup', setupListener);
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
