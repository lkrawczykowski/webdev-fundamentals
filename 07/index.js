console.log("index.js");

window.onload = function () {

    var m = model();
    var v = view();
    var c = controller(m, v);

    document.addEventListener("keydown", function (e) {
        c.any_key();
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
            console.log("update_field");
            var all_fields = document.querySelectorAll("#game-wrapper > div > div");
            for (var i = 0; i < 9; i++)
                all_fields[i].innerHTML = ["-", "O", "X"][field[i]];
            var index = 3 * cursor[1] + cursor[0];
            document.querySelectorAll("#game-wrapper > div > div")[index].innerHTML = "[ ]";
        },
        update_header: function (player) {
            document.querySelector("#player-indicator").innerHTML = "Player " + player + " moves";
        }
    }
}

function controller(model, view) {
    var controller = {
        model: model,
        view: view,
        move_cursor: function (x, y) {
            if (model.state != 2) {
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
                    if (true) {
                        model.state = 3; //finished
                        console.log("finished");
                    } else {
                        //chenge state
                        var pending_state = model.state === 0 ? 1 : 0;
                        var pending_value = model.state === 0 ? 1 : 2;
                        model.state = 2;
                        console.log(model.field);
                        setTimeout(function () {
                            console.log("1000 ms");
                            model.field[index] = pending_value;
                            model.state = pending_state;
                            console.log(model.field);
                            view.update_field(model.field, model.cursor);
                            view.update_header(pending_state === 0 ? "O" : "X");
                        }, 1000);
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
            view.update_header("O");
        },
        any_key: function () {
            console.log("any_key");
            if (model.state === 3)
                controller.reset();
        }
    }
    controller.reset();
    return controller;
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