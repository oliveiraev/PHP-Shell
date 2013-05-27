(function (window) {
    "use strict";
    var document, token, form, output;
    document = window.document;
    form = document.getElementById('console-view');
    output = document.getElementById('console-messages');
    function getToken(extension) {
        var data, document;
        document = window.document;
        data = document.createElement('div');
        data.style.display = 'none';
        data.innerHTML = extension.xhr.responseText;
        document.body.appendChild(data);
        token = document.getElementsByName('token')[0].value;
    }
    function getEvaluatedStatement(extension) {
        var statementReturn;
        statementReturn = document.createElement('pre');
        statementReturn.innerHTML = extension.xhr.responseText;
        output.appendChild(statementReturn);
    }
    function sendStatement(event) {
        var input, inputData, statement;
        input = form.elements[0];
        event.preventDefault();
        if (!token) {
            return;
        }
        inputData = 'innerHTML';
        if (input.tagName === 'INPUT') {
            inputData = 'value';
        }
        statement = encodeURIComponent(input[inputData]).replace(/\+/g, '%2B');
        input[inputData] = '';
        window.chrome.runtime.sendMessage(
            {'path': 'shell.do?token=' + token + '&statement=' + statement},
            getEvaluatedStatement
        );
    }
    form.addEventListener('submit', sendStatement);
    window.chrome.runtime.sendMessage({}, getToken);
}(window));
