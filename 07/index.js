window.onload = function () {
    var m = model();
    var v = view();
    var c = controller(m, v);
    document.addEventListener("keydown", function (e) {
        if (e.code === "ArrowUp")
            c.move_cursor(0, -1);
        else if (e.code === "ArrowDown")
            c.move_cursor(0, 1);
        else if (e.code === "ArrowLeft")
            c.move_cursor(-1, 0);
        else if (e.code === "ArrowRight")
            c.move_cursor(1, 0);
        else if (e.code === "Space")
            c.confirm_move();
        c.any_key();
    });
}

/*
state:
0 o moving
1 x moving
2 waiting
3 finished

field:
0 free
1 o
2 x
*/

function model() {
    /*
    state:
    0 o moving
    1 x moving
    2 waiting
    3 finished
    
    field:
    0 free
    1 o
    2 x
    */
    
    return {
        field: [],
        cursor: [],
        state: 0
    }
}

function view() {
    return {
        update_view: function (field, cursor) {
            var divs = document.querySelectorAll("#game-wrapper > div > div");
            for (var i = 0; i < divs.length; i++)
                divs[i].innerHTML = ["-", "O", "X"][field[i]];
            var cursor_index = 3 * cursor[1] + cursor[0];
            divs[cursor_index].innerHTML = "[" + divs[cursor_index].innerHTML + "]";
        },
        update_header: function (header_text) {
            document.querySelector("#game-header").innerHTML = header_text;
        }
    }
}

function controller(model, view) {
    var controller = {
        model: model,
        view: view,
        move_cursor: function (x, y) {
            if (model.state === 0 || model.state === 1) {
                model.cursor[0] += x;
                if (model.cursor[0] < 0)
                    model.cursor[0] += 3;
                else if (model.cursor[0] > 2)
                    model.cursor[0] -= 3;
                model.cursor[1] += y;
                if (model.cursor[1] < 0)
                    model.cursor[1] += 3;
                else if (model.cursor[1] > 2)
                    model.cursor[1] -= 3;
                view.update_view(model.field, model.cursor);
            }
        },
        confirm_move: function () {
            if (model.state === 0 || model.state === 1) {
                var cursor_index = 3 * model.cursor[1] + model.cursor[0];
                if (model.field[cursor_index] === 0) {
                    var pending_state = model.state === 0 ? 1 : 0;
                    var pending_value = model.state === 0 ? 1 : 2;
                    model.state = 2;
                    setTimeout(function () {
                        model.field[cursor_index] = pending_value;
                        var result = game_result(model.field);
                        if (result === 1) {
                            view.update_header("Player O won!");
                            model.state = 3;
                        } else if (result === 2) {
                            view.update_header("Player X won!");
                            model.state = 3;
                        } else if (!some(model.field, is_field_empty)) {
                            view.update_header("Draw");
                            model.state = 3;
                        } else {
                            view.update_header("Player " + (pending_state === 0 ? "O" : "X") + " moves");
                            model.state = pending_state;
                        }
                        view.update_view(model.field, model.cursor);
                    }, 300);
                }
            }
        },
        reset: function () {
            model = {
                field: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                cursor: [1, 1],
                state: 0
            };
            view.update_view(model.field, model.cursor);
            view.update_header("Player " + (model.state === 0 ? "O" : "X") + " starts game");
        },
        any_key: function () {
            if (model.state === 3)
                controller.reset();
        }
    }
    controller.reset();
    return controller;
}

function is_field_empty(v) {
    return v === 0;
}

function some(a1, f1) {
    for (var i = 0; i < a1.length; i++)
        if (f1(a1[i]))
            return true;
    return false;
}

function game_result(field) {
    var possible_lines = [
        [1, 0, 0, 1, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 1, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 1, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1],
        [0, 0, 1, 0, 1, 0, 1, 0, 0],
    ];
    for (var i = 0; i < possible_lines.length; i++) {
        if (is_complete(possible_lines[i], field, 1))
            return 1;
        else if (is_complete(possible_lines[i], field, 2))
            return 2;
    }
    return 0;
}

function is_complete(line_mask, line, player) {
    for (var i = 0; i < line_mask.length; i++)
        if (line_mask[i] === 1 && line[i] !== player)
            return false;
    return true;
}