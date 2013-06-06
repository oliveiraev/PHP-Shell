/**
 * The extension interface
 *
 * @author Evandro Oliveira <evandro [at] gmail [dot] com>
 *
 * This file describes the full extension interface. The standard properties and
 * methods available to the PHPShell instances.
 *
 * Please, make sure to use the proper browser files to make adaptations or not
 * shared implementations. Take care to put here only code that could be shared
 * among all the major browser vendors - currently, Chrome, Safari, Firefox,
 * Opera and, unfortunately, IE.
 *
 * Changing the host address to a CORS enabled server, any browser, on any
 * implementation, should be able to put this extension to work.
 *
 * Currently, PHPShell.parse issue a GET request against PHPShell.host appending
 * the statement as an URI parameter. Thus, having host as myhost.com and
 * calling PHPShell.parse('echo "Hello, World!"'), a request to
 * 'myhost.com?statement=echo "Hello, World!"' is issued. Make sure to prepare,
 * encode and escape any character that could be sensible to the server.
 */
(function (window) {
    "use strict";
    var document = window.document;

    /**
     * PHPShell class definition and constructor
     * @returns {PHPShell}
     * @constructor
     */
    function PHPShell() {
        this.xhr = new window.XMLHttpRequest();
        this.events = document.createDocumentFragment();
        // Override this method with browsers' particular implementations
        // Dont forget to call it too!
        this.setup();
        return this;
    }

    /**
     * Event handler
     * @type {DocumentFragment}
     */
    PHPShell.prototype.events = window.document.createDocumentFragment();
    /**
     * The statements parser server (URI)
     * @type {string}
     */
    PHPShell.prototype.host = null;
    /**
     * Xhr Calls Helper
     *
     * Mixes open and send methods in one.
     * @param method {string} @optional The request method.
     * @param path {string} @optional host completion path
     */
    PHPShell.prototype.open = function (method, path) {
        this.xhr.open(method || 'get', this.host + (path || ''), true);
        this.xhr.send();
    };
    /**
     * Makes event listeners receive the instance on the event argument.
     * Makes sure that shared/prototye event listeners be called too.
     * Also, dispatches a setup event.
     */
    PHPShell.prototype.setup = function () {
        var setupEvent;
        this.events.dispatchEvent = (function (instance, dispatch) {
            return function (event) {
                event.instance = instance;
                instance.constructor.prototype.events.dispatchEvent(event);
                dispatch.call(instance.events, event);
            };
        }(this, this.events.dispatchEvent));
        setupEvent = document.createEvent('Event');
        setupEvent.initEvent('setup', false, false);
        this.events.dispatchEvent(setupEvent);
    };
    /**
     * The parser
     *
     * Main method of the class. Send statement to the server and dispatch a
     * _parse_ event on response.
     * You may also listen for xhr.onreadystatechange but, using parse listener
     * is more friendly and verbose. instance.addEventListener('parse', func...
     *
     * This also ensure that various callbacks could be called after parse
     * completion. Attaching various xhr.addEventListener('readystatechange')
     * could led to undesired behaviors.
     *
     * @param statement {string} The PHP Statement that you want to evaluate.
     */
    PHPShell.prototype.parse = function (statement) {
        var prepend = '?';
        this.xhr.onreadystatechange = (function (instance) {
            return function () {
                var event = document.createEvent('Event');
                if (this.readyState !== 4) {
                    return;
                }
                event.initEvent('parse', true, false);
                instance.events.dispatchEvent(event);
            };
        }(this));
        if (this.host.indexOf(prepend) > -1) {
            prepend = '&';
        }
        this.open('get', prepend + 'statement=' + statement);
    };
    window.PHPShell = PHPShell;
}(window));
