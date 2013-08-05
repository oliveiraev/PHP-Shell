(function (window) {
    "use strict";
    var document, PHPShell, form, input, output;
    document = window.document;
    form = document.getElementById('console-view');
    input = document.getElementById('input');
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
    input.addEventListener("keydown", function (event) {
        if (event.keyCode !== 13) {
            return true;
        }
        if (this.multiline === undefined) {
            this.multiline = false;
        }
        if (event.shiftKey === this.multiline) {
            this.form.dispatchEvent(new window.CustomEvent("submit"));
            this.multiline = false;
            this.setAttribute("rows", "1");
            return false;
        }
        if (event.shiftKey) {
            this.multiline = true;
        }
        this.setAttribute("rows", this.getAttribute("rows") + 1);
        return true;
    });
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        PHPShell.parse(encodeURIComponent(input.value).replace(/\+/g, '%2B'));
    });
    PHPShell.events.addEventListener('parse', function () {
        var statementReturn;
        statementReturn = document.createElement('pre');
        statementReturn.innerHTML = PHPShell.xhr.responseText;
        output.appendChild(statementReturn);
        form.reset();
    });
}(window));
