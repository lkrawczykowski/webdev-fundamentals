var library = require("../library.js");

describe('evaluate_rpn()', function () {
    it('should evaluate sample expression', function (done) {
        if (library.evaluate_rpn("5 1 2 + 4 * + 3 -") === 14)
            done();
        else
            done("expression evaluated incorrectly")
    });

    it('should evaluate sample expression with extra operators', function (done) {
        if (library.evaluate_rpn("15 5 1 2 + 4 * + 3 -", "%") === 1)
            done();
        else
            done("expression evaluated incorrectly")
    });

});