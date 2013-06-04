(function (window) {
    "use strict";
    var document, form;
    document = window.document;
    form = document.getElementById('console-view');
    function parsedData(parsed) {
        var statementReturn;
        if (!parsedData.out) {
            parsedData.out = document.getElementById('console-messages');
        }
        statementReturn = document.createElement('pre');
        statementReturn.innerHTML = parsed.response;
        parsedData.out.appendChild(statementReturn);
        form.reset();
    }
    function sendStatement(event) {
        var element, i, statement, inputData;
        event.preventDefault();
        statement = '';
        for (i = 0; i < sendStatement.ln; i += 1) {
            element = form.elements[i];
            inputData = element.tagName === 'TEXTAREA' ? 'innerHTML' : 'value';
            statement += element[inputData];
        }
        statement = encodeURIComponent(statement).replace(/\+/g, '%2B');
        sendStatement.shell.parse(statement);
    }
    sendStatement.ln = form.elements.length;
    sendStatement.shell = new window.PHPShell();
    document.addEventListener('parse', parsedData);
    form.addEventListener('submit', sendStatement);
}(window));
