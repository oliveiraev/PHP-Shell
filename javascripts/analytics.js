(function (window) {
    "use strict";
    var document, script, host;
    document = window.document;
    host = "https://ssl.";
    if (document.location.protocol !== "https") {
        host = "http://www.";
    }
    script = document.createElement('script');
    script.type = "text/javascript";
    script.async = "async";
    script.defer = "defer";
    script.src = host + "google-analytics.com/ga.js";
    script.onload = function () {
        window._gat = window._gat || {};
        //noinspection JSUnresolvedFunction
        window._gat._getTracker("UA-41243951-2")._trackPageview();
    };
    document.head.appendChild(script);
}(window));
