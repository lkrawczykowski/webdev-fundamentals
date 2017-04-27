window.onload = function () {
    var gameModel = Model();
    var gameView = View();
    var gameController = Controller(gameModel, gameView);
    document.addEventListener("keydown", function (e) {
        if (e.code === "ArrowUp")
            gameController.moveCursor(0, -1);
        else if (e.code === "ArrowDown")
            gameController.moveCursor(0, 1);
        else if (e.code === "ArrowLeft")
            gameController.moveCursor(-1, 0);
        else if (e.code === "ArrowRight")
            gameController.moveCursor(1, 0);
        else if (e.code === "Space")
            gameController.confirmMove();
        gameController.anyKey();
    });
    document.querySelector("#reset-game-button").addEventListener("click", function (e) {
        gameController.reset();
    });
    document.querySelector("#board-style-selection").addEventListener("change", function (e) {
        gameView.renderer = e.srcElement.value;
        gameView.updateView(gameModel.field, gameModel.cursor);
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

function Model() {
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
        saveGameState: function () {
            var gameState = JSON.stringify(this);
            window.localStorage.setItem("ttt_game_state", gameState);
        },
        hasSavedGameState: function () {
            return (window.localStorage.getItem("ttt_game_state") !== null);
        },
        loadGameState: function () {
            var gameState = JSON.parse(window.localStorage.getItem("ttt_game_state"));
            if (gameState !== null) {
                this.field = gameState.field;
                this.cursor = gameState.cursor;
                this.state = gameState.state;
            }
        }
    }
}

function View() {
    return {
        renderer: "text_board",
        textBoardElement: document.querySelector("#text-board"),
        canvasBoardElement: document.querySelector("#canvas-board"),
        textBoardFields: document.querySelectorAll("#text-board > div > div"),
        headerElement: document.querySelector("#game-header"),
        updateView: function (field, cursor) {
            this.textBoardElement.style.display = (this.renderer === "text_board") ? "block" : "none";
            this.canvasBoardElement.style.display = (this.renderer === "canvas_board") ? "block" : "none";
            if (this.renderer === 'text_board') {
                for (var i = 0; i < this.textBoardFields.length; i++)
                    this.textBoardFields[i].innerHTML = ["-", "O", "X"][field[i]];
                var cursorIndex = 3 * cursor[1] + cursor[0];
                this.textBoardFields[cursorIndex].innerHTML = "[" + this.textBoardFields[cursorIndex].innerHTML + "]";
            } else if (this.renderer === "canvas_board") {
                let context = this.canvasBoardElement.getContext('2d');
                context.fillStyle = '#b3e5fc';
                context.fillRect(0, 0, 400, 300);
                context.strokeStyle = '#5c6bc0';
                context.lineWidth = 3;
                for (var i = 0; i < 3; i++) {
                    for (var j = 0; j < 3; j++) {
                        var index = j * 3 + i;
                        if (field[index] === 1) {
                            placeO(50 + 100 * i, 50 + 100 * j);
                        } else if (field[index] === 2) {
                            placeX(50 + 100 * i, 50 + 100 * j);
                        }
                    }
                }

                placeRect(50 + 100 * cursor[0], 50 + 100 * cursor[1]);

                function placeX(x, y) {
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

                function placeO(x, y) {
                    context.beginPath();
                    context.arc(x, y, 20, 0, Math.PI * 2, true);
                    context.closePath();
                    context.stroke();
                }

                function placeRect(x, y) {
                    var size = 25;
                    context.strokeRect(x - size, y - size, 2 * size, 2 * size);
                }
            }
        },
        updateHeader: function (headerText) {
            this.headerElement.innerHTML = headerText;
        }
    }
}

function Controller(model, view) {
    var controller = {
        model: model,
        view: view,
        moveCursor: function (x, y) {
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
                view.updateView(model.field, model.cursor);
                model.saveGameState();
            }
        },
        confirmMove: function () {
            if (model.state === 0 || model.state === 1) {
                var cursorIndex = 3 * model.cursor[1] + model.cursor[0];
                if (model.field[cursorIndex] === 0) {
                    var pendingState = model.state === 0 ? 1 : 0;
                    var pendingValue = model.state === 0 ? 1 : 2;
                    model.state = 2;
                    setTimeout(function () {
                        model.field[cursorIndex] = pendingValue;
                        var result = gameResult(model.field);
                        if (result === 1) {
                            headerText = "Player O won!";
                            model.state = 3;
                        } else if (result === 2) {
                            headerText = "Player X won!";
                            model.state = 3;
                        } else if (!model.field.some(x => isFieldEmpty(x))) {
                            headerText = "Draw";
                            model.state = 3;
                        } else {
                            headerText = "Player " + (pendingState === 0 ? "O" : "X") + " moves";
                            model.state = pendingState;
                        }
                        view.updateHeader(headerText);
                        model.saveGameState();
                        view.updateView(model.field, model.cursor);
                    }, 300);
                }
            }
        },
        reset: function () {
            this.model.field = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            this.model.cursor = [1, 1];
            this.model.state = 0;
            this.model.saveGameState();
            this.view.updateView(model.field, model.cursor);
            this.view.updateHeader("Player " + (model.state === 0 ? "O" : "X") + " starts game");
        },
        anyKey: function () {
            if (model.state === 3) {
                controller.reset();
                model.saveGameState();
            }
        }
    }
    if (model.hasSavedGameState()) {
        model.loadGameState();
        view.updateView(controller.model.field, controller.model.cursor);
    }
    else
        controller.reset();
    return controller;
}

function isFieldEmpty(v) {
    return v === 0;
}

function gameResult(field) {
    var possibleLines = [
        [1, 0, 0, 1, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 1, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 1, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1],
        [0, 0, 1, 0, 1, 0, 1, 0, 0],
    ];
    for (var i = 0; i < possibleLines.length; i++) {
        if (isComplete(possibleLines[i], field, 1))
            return 1;
        else if (isComplete(possibleLines[i], field, 2))
            return 2;
    }
    return 0;
}

function isComplete(lineMask, line, player) {
    for (var i = 0; i < lineMask.length; i++)
        if (lineMask[i] === 1 && line[i] !== player)
            return false;
    return true;
}