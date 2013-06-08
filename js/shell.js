(function (window) {
    "use strict";
    var document, PHPShell, form, output;
    document = window.document;
    form = document.getElementById('console-view');
    output = document.getElementById('console-messages');
    PHPShell = window.PHPShell;
    PHPShell.events.addEventListener('setup', function (event) {
        event.instance.xhr.onreadystatechange = function () {
            var data, html;
            if (this.readyState !== 4) {
                return;
            }
            data = /(<input[\s\S]+\btoken\b[\s\S]*?>)/mg;
            html = document.createElement('div');
            html.innerHTML = data.exec(this.responseText)[0];
            event.instance.token = html.childNodes[0].value;
            event.instance.host += 'shell.do?token=' + event.instance.token;
        };
        event.instance.host = 'https://php-minishell.appspot.com/';
        event.instance.open();
    });
    PHPShell = new PHPShell();
    form.addEventListener('submit', function (event) {
        var element, elements, i, ln, statement, inputData;
        event.preventDefault();
        elements = form.elements;
        statement = '';
        for (i = 0, ln = elements.length; i < ln; i += 1) {
            element = elements[i];
            inputData = element.tagName === 'TEXTAREA' ? 'innerHTML' : 'value';
            statement += element[inputData];
        }
        PHPShell.parse(encodeURIComponent(statement).replace(/\+/g, '%2B'));
    });
    PHPShell.events.addEventListener('parse', function () {
        var statementReturn;
        statementReturn = document.createElement('pre');
        statementReturn.innerHTML = PHPShell.xhr.responseText;
        output.appendChild(statementReturn);
        form.reset();
    });
}(window));
