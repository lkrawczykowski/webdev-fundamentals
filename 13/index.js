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
    document.querySelector("#reset-game-button").addEventListener("click", function(e) {
        c.reset();
    });
    document.querySelector("#board-style-selection").addEventListener("change", function(e) {
        v.renderer = e.srcElement.value;
        v.update_view(m.field, m.cursor);
    })
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
        state: 0,
        save_game_state: function() {
            var game_state = JSON.stringify(this);
            window.localStorage.setItem("ttt_game_state", game_state);
        },
        has_saved_game_state: function() {
            return (window.localStorage.getItem("ttt_game_state") !== null);
        },
        load_game_state: function() {
            var game_state = JSON.parse(window.localStorage.getItem("ttt_game_state"));
            if(game_state !== null) {
                this.field = game_state.field;
                this.cursor = game_state.cursor;
                this.state = game_state.state;
            }
        }
    }
}

function view() {
    return {
        renderer: "text_board",
        update_view: function (field, cursor) {
            document.querySelector("#text-board").style.display = (this.renderer === "text_board") ? "block": "none";
            document.querySelector("#canvas-board").style.display = (this.renderer === "canvas_board") ? "block": "none";
            if(this.renderer === 'text_board') {
                var divs = document.querySelectorAll("#text-board > div > div");
                for (var i = 0; i < divs.length; i++)
                    divs[i].innerHTML = ["-", "O", "X"][field[i]];
                var cursor_index = 3 * cursor[1] + cursor[0];
                divs[cursor_index].innerHTML = "[" + divs[cursor_index].innerHTML + "]";
            } else if (this.renderer === "canvas_board") {
                let context = document.querySelector("#canvas-board").getContext('2d');
                context.fillStyle = '#b3e5fc';
                context.fillRect(0, 0, 400, 300);
                context.strokeStyle = '#5c6bc0';
                context.lineWidth = 3;
                for(var i = 0; i < 3; i++) {
                     for(var j = 0; j < 3; j++) {
                        var index = j*3 + i;
                        if (field[index] === 1) {
                            place_o(50 + 100*i,50+100*j);
                        } else if (field[index] === 2) {
                            place_x(50 + 100*i,50+100*j);
                        }
                     }
                }

                place_rect(50 + 100*cursor[0], 50 + 100*cursor[1]);

                function place_x(x, y) {
                    var size = 15;

                    context.beginPath();
                    context.moveTo(x - size, y + size);
                    context.lineTo(x + size, y - size);
                    context.closePath();
                    context.stroke();

                    context.beginPath();
                    context.moveTo(x - size, y - size);
                    context.lineTo(x + size, y + size);
                    context.closePath();
                    context.stroke();
                }

                function place_o(x, y) {
                    context.beginPath();
                    context.arc(x, y, 20, 0, Math.PI*2, true); 
                    context.closePath();
                    context.stroke();
                }

                function place_rect(x, y) {
                    var size = 25;
                    context.strokeRect(x - size, y - size, 2*size, 2*size);
                }
            }
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
                model.save_game_state();
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
                        model.save_game_state();
                        view.update_view(model.field, model.cursor);
                    }, 300);
                }
            }
        },
        reset: function () {
            this.model.field = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.model.cursor = [1, 1];
            this.model.state = 0;
            this.model.save_game_state();
            this.view.update_view(model.field, model.cursor);
            this.view.update_header("Player " + (model.state === 0 ? "O" : "X") + " starts game");
        },
        any_key: function () {
            if (model.state === 3) {
                controller.reset();
                model.save_game_state();
            }
        }
    }
    if(model.has_saved_game_state()) {
        model.load_game_state();
        view.update_view(controller.model.field, controller.model.cursor);
    }
    else
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