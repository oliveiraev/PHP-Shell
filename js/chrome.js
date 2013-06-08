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
    var instance, PHPShell;
    // lookup reduction
    PHPShell = window.PHPShell;
    // This instance will be responsible to call the server
    instance = new PHPShell();
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
    /**
     * Setting up an xhr proxy for new instances of PHPShell
     *
     * @param realXhr {XMLHttpRequest} This instance will be abandoned
     * We need it only to make up the initial fakeXhr properties
     * @param fakeXhr {DocumentFragment} The relevant instance
     * This will be responsible to route calls into chrome messages, when
     * required, and update itself on message responses.
     * @returns {DocumentFragment} fakeXhr bumped up
     */
    function xhrProxy(realXhr, fakeXhr) {
        var i;
        // Mapping real xhr properties to the faked one
        for (i in realXhr) {
            if (realXhr.hasOwnProperty(i)) {
                fakeXhr[i] = realXhr[i];
            }
        }
        // When got a response, then remap the properties from the cool xhr to
        // our local proxy
        function response(message) {
            var i, event;
            for (i in message) {
                if (message.hasOwnProperty(i)) {
                    fakeXhr[i] = message[i];
                }
            }
            // And, also, make sure to dispatch readystatechange
            event = fakeXhr.ownerDocument.createEvent('Event');
            event.initEvent('readystatechange', true, false);
            fakeXhr.dispatchEvent(event);
        }
        // Proxying the methods
        // Calling, for instance, xhr.open will send a request to the background
        // instance perform the real open action.
        function proxy(action) {
            var args;
            return function () {
                args = arguments;
                args.action = action;
                window.chrome.runtime.sendMessage(args, response);
            };
        }
        fakeXhr.open = proxy('open');
        fakeXhr.send = proxy('send');
        fakeXhr.getAllResponseHeaders = function () {
            return this.responseHeaders || '';
        };
        // By default, DOM#objects# doesn't handle onreadystatechange
        // We'll make sure that such method be called
        fakeXhr.addEventListener('readystatechange', function (event) {
            if (typeof fakeXhr.onreadystatechange === 'function') {
                fakeXhr.onreadystatechange(event);
            }
        });
        return fakeXhr;
    }
    PHPShell.events.addEventListener('setup', function (event) {
        var realXhr, fakeXhr;
        realXhr = event.instance.xhr;
        fakeXhr = event.instance.events.ownerDocument.createDocumentFragment();
        event.instance.xhr = xhrProxy(realXhr, fakeXhr);
    });
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
