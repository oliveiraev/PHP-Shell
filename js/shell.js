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
        var index, history;
        if ((event.keyCode !== 38 && event.keyCode !== 40) || this.multiline) {
            return true;
        }
        history = this.history;
        index = history.index + event.keyCode - 39;
        if (history[index]) {
            this.value = history[index];
            this.rows = this.value.split("/\n\r|\n|\r/mg").length - 1;
            history.index = index;
        }
        return false;
    });
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
        if (!input.history) {
            input.history = [];
        }
        PHPShell.parse(encodeURIComponent(input.value).replace(/\+/g, '%2B'));
        input.history.push(input.value);
        input.history.index = input.history.length;
        input.value = input.innerHTML = "";
    });
    PHPShell.events.addEventListener('parse', function () {
        var statementReturn;
        statementReturn = document.createElement('pre');
        statementReturn.innerHTML = PHPShell.xhr.responseText;
        output.appendChild(statementReturn);
        form.reset();
    });
}(window));
