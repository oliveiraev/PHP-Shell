(function (window) {
    "use strict";
    var document, script;
    function trackPageview(analyticsObject, UserId) {
        analyticsObject.push(['_setAccount', UserId]);
        analyticsObject.push(['_trackPageview']);
    }
    document = window.document;
    script = document.createElement('script');
    script.async = "async";
    script.defer = "defer";
    script.type = "text/javascript";
    script.src = "https://ssl.google-analytics.com/ga.js";
    script.onload = function () {
        //noinspection JSUnresolvedVariable
        var analytics = window._gaq;
        trackPageview(analytics, 'UA-41243951-3');
        trackPageview(analytics, 'UA-40486958-2');
    };
    document.head.appendChild(script);
}(window));
