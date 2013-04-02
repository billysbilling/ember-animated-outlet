var page = require('webpage').create();

page.onError = function(message, trace) {
    console.log('Page error: '+message, 'ERROR');
    phantom.exit(1);
};
page.onInitialized = function() {
    page.evaluate(function() {
        window.isCli = true;
    });
};

function checkDone() {
    var result = page.evaluate(function() {
        return window.cliResults;
    });
    if (!result || !result.isDone) {
        setTimeout(checkDone, 10);
        return;
    }
    var details = result.details;
    console.log("Total: " + details.total+ ", Failed: " + details.failed + ", Passed: " + details.passed + ", Runtime: " + details.runtime);
    if (details.failed) {
        console.log('TESTS FAILED');
        result.failures.forEach(function(details) {
            console.log(details.module + ': ' + details.name);
        }, this);
    } else {
        console.log('SUCCESS');
    }
    phantom.exit(details.failed ? 1 : 0);
}

var url = 'file://localhost'+require('fs').workingDirectory+'/tests.html';
page.open(url, function(status) {
    if (status !== 'success') {
        console.log('Could not open '+url);
        phantom.exit(1);
    }
    checkDone();
});