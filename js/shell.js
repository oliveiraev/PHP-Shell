(function (window) {
    "use strict";
    var document, form;
    document = window.document;
    form = document.getElementById('console-view');
    function printStatement(PHPShell) {
        var statementReturn;
        if (!printStatement.out) {
            printStatement.out = document.getElementById('console-messages');
        }
        statementReturn = document.createElement('pre');
        statementReturn.innerHTML = PHPShell.xhr.responseText;
        printStatement.out.appendChild(statementReturn);
    }
    function sendStatement(event) {
        var inputData, statement;
        if (!sendStatement.input) {
            sendStatement.input = form.elements[0];
        }
        event.preventDefault();
        inputData = 'innerHTML';
        if (sendStatement.input.tagName === 'INPUT') {
            inputData = 'value';
        }
        statement = encodeURIComponent(sendStatement.input[inputData]);
        statement = statement.replace(/\+/g, '%2B');
        sendStatement.input[inputData] = '';
        sendStatement.shell.parse(statement, printStatement);
    }
    sendStatement.shell = new window.PHPShell();
    form.addEventListener('submit', sendStatement);
}(window));
