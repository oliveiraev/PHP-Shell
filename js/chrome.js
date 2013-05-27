(function (window) {
    "use strict";
    var extension = window.PHPShell;
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
    function messageListener(message, sender, responseCallback) {
        extension.onXhrLoaded = responseCallback;
//        //noinspection JSUnresolvedVariable
        extension.open(message.method, message.path);
        return !!sender;
    }
    window.chrome.runtime.onMessage.addListener(messageListener);
}(window));
