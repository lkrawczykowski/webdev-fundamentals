window.onload = function () {

    var m = model();
    var v = view();
    var c = controller(m, v);

    document.addEventListener("keydown", function (e) {
        //console.log(e);
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

function model() {
    return {
        field: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        cursor: [1, 1],
        state: 0
    }
}

function view() {
    return {
        update_field: function (field, cursor) {
            //console.log("update_field");
            var all_fields = document.querySelectorAll("#game-wrapper > div > div");
            for (var i = 0; i < 9; i++)
                all_fields[i].innerHTML = ["-", "O", "X"][field[i]];
            var index = 3 * cursor[1] + cursor[0];
            document.querySelectorAll("#game-wrapper > div > div")[index].innerHTML = "[" + ["-", "O", "X"][field[index]] + "]";
        },
        update_header: function (header_text) {
            document.querySelector("#player-indicator").innerHTML = header_text;
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

                //console.log(x, y);
                //console.log(model.cursor);

                view.update_field(model.field, model.cursor);
            }
        },
        confirm_move: function () {
            console.log("confirm_move");
            if (model.state === 0 || model.state === 1) {
                var index = 3 * model.cursor[1] + model.cursor[0];
                if (model.field[index] === 0) {


                    //check if someone won
                    if (false) {
                        model.state = 3; //finished
                        console.log("finished");
                        view.update_field(model.field, model.cursor);
                    } else {
                        //chenge state
                        var pending_state = model.state === 0 ? 1 : 0;
                        var pending_value = model.state === 0 ? 1 : 2;
                        model.state = 2;
                        setTimeout(function () {
                            console.log("300 ms");
                            model.field[index] = pending_value;
                            model.state = pending_state;
                            console.log(model.field);

                            var result = game_result(model.field);
                            if (result === 1) {
                                model.state = 3;
                                view.update_header("Player O won!");
                                //O won
                            } else if (result === 2) {
                                model.state = 3;
                                view.update_header("Player X won!");
                                //X won
                            } else if (!some(model.field, empty)) {
                                //no line, field full, draw
                                model.state = 3;
                                view.update_header("Draw");
                            } else {
                                view.update_header("Player " + (pending_state === 0 ? "O" : "X") + " moves");
                            }

                            view.update_field(model.field, model.cursor);
                        }, 300);
                    }
                }
                else {
                    console.log("field taken");
                }
            }
        },
        reset: function () {
            console.log("reset");
            model = {
                field: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                cursor: [1, 1],
                state: 0
            };
            view.update_field(model.field, model.cursor);
            view.update_header("Player " + (model.state === 0 ? "O" : "X") + " starts game");
        },
        any_key: function () {
            //console.log("any_key");
            if (model.state === 3)
                controller.reset();
        }
    }
    controller.reset();
    return controller;
}

function empty(v) {
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


input:
left right up down space



*/