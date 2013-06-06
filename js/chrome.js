/**
 * Here comes the Google Chrome/blink-related adaptations.
 *
 * @author Evandro Oliveira <evandrofranco [at] gmail [dot] com>
 *
 * Due to permission issues -
 * (http://stackoverflow.com/questions/16703446/another-cross-xhr-related) -
 * it's impossible to make cross-domain xhr calls directly from shell.html page.
 *
 * Chrome docs recommends use a background script that "listen" for requests and
 * is able to make cross-domain xhr requests. These requests should be replied
 * in form of a callback, received from the listener.
 * #Ref (http://developer.chrome.com/extensions/devtools.html)
 *
 * To make this behaviour most transparent as possible, we've implemented such a
 * type of Proxy (http://en.wikipedia.org/wiki/Proxy_pattern) that is
 * responsible to redirect xhr requests of low-permissioned instances to the
 * listener, that has elevated privileges.
 */
(function (window) {
    "use strict";
    var instance, setup, PHPShell;
    // lookup reduction
    PHPShell = window.PHPShell.prototype;
    // Here, we skip setup() call. We don't want token in this instance
    setup = PHPShell.setup;
    PHPShell.setup = function () {};
    // This instance will be responsible to call the server
    instance = new window.PHPShell();
    // Here we listen for server calls and redirect them to _instance_
    window.chrome.runtime.onMessage.addListener(
        function (message, sender, callback) {
            var i, action, args;
            args = [];
            action = message.action;
            delete message.action;
            // If we're about to make an xhr-call, set up a listener for it
            if (action === 'send') {
                callback.sender = sender;
                instance.xhr.onreadystatechange = function () {
                    if (!(this.readyState === 4 && callback.sender)) {
                        return;
                    }
                    this.responseHeaders = this.getAllResponseHeaders();
                    callback.sender = null;
                    callback(this);
                };
            }
            // Here, we redirect the arguments to instance.xhr._desired_method_
            for (i in message) {
                if (message.hasOwnProperty(i)) {
                    args.push(message[i]);
                }
            }
            instance.xhr[action].apply(instance.xhr, args);
            return true;
        }
    );
    // Setting up an xhr proxy for new instances of PHPShell
    PHPShell.setup = function () {
        var i, document, oldXhr, newXhr;
        document = this.events.ownerDocument;
        oldXhr = this.xhr;
        // We need a DOM#object# to provide event listeners
        newXhr = this.xhr = document.createDocumentFragment();
        // By default, DOM#objects# doesn't handle onreadystatechange
        function xhrListener(event) {
            if (typeof newXhr.onreadystatechange === 'function') {
                newXhr.onreadystatechange(event);
            }
        }
        // Here, we grab the global instance.xhr and map to the local one
        function response(message) {
            var i, event;
            for (i in message) {
                if (message.hasOwnProperty(i)) {
                    newXhr[i] = message[i];
                }
            }
            // And, also, make sure to dispatch readystatechange
            event = document.createEvent('Event');
            event.initEvent('readystatechange', true, false);
            newXhr.dispatchEvent(event);
        }
        // Proxy local xhr methods.
        // Calling, for instance, xhr.open will send a request to the background
        // instance perform the open action.
        function proxy(action) {
            var args;
            return function () {
                args = arguments;
                args.action = action;
                window.chrome.runtime.sendMessage(args, response);
            };
        }
        // Mapping real xhr properties to the faked one
        for (i in oldXhr) {
            if (oldXhr.hasOwnProperty(i)) {
                newXhr[i] = oldXhr[i];
            }
        }
        newXhr.open = proxy('open');
        newXhr.send = proxy('send');
        newXhr.getAllResponseHeaders = function () {
            return this.responseHeaders || '';
        };
        // Making sure that xhr.onreadystatechange will be called
        newXhr.addEventListener('readystatechange', xhrListener);
        setup.apply(this);
    };
    // IDE helper/syntatic sugar
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
