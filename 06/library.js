module.exports = {
    evaluate_rpn: function (expression_string, extra_operators = "", verbose = false) {

        expression_string = expression_string + " " + extra_operators;

        var splitted = expression_string.split(" ");
        var filtered = filter_not_empty_string(splitted);

        var stack = [];

        for (var i = 0; i < filtered.length; i++) {
            var input = filtered[i];
            var parsed = parseInt(input);
            if (isNaN(parsed)) {
                var b = stack.pop();
                var a = stack.pop();
                if (input === "+")
                    stack.push(a + b);
                else if (input === "-")
                    stack.push(a - b);
                else if (input === "*")
                    stack.push(a * b);
                else if (input === "%")
                    stack.push(a % b);
                else
                    throw new Error("unknown symbol " + input);
            }
            else {
                stack.push(parsed);
                if (verbose) {
                    console.log("pushing " + input + " to stack");
                    console.log("stack:  " + stack);
                }
            }
        }

        if (stack.length !== 1)
            throw new Error("evaluation failed");

        console.log(stack[0]);

        return stack[0];
    }
}

function filter_not_empty_string(a1) {
    return filter(a1, is_not_empty_string);
}

function is_not_empty_string(s) {
    return s !== '' && s !== ' ';
}

function filter(a1, f1) {
    var a2 = [];
    for (var i = 0; i < a1.length; i++)
        if (f1(a1[i]))
            a2.push(a1[i]);
    return a2;
}

function some(a1, f1) {
    for (var i = 0; i < a1.length; i++)
        if (f1(a1[i]))
            return true;
    return false;
}