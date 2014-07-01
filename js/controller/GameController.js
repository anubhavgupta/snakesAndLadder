(function () {

    //modules
    var Model = module("app.model");
    var View = module("app.view");
    var Controller = module("app.controller");

    /**
     * GameController
     * This classes links model(GameData) to view(grid,playerPieces,detailsWindow)
     *
     * @injected - GameStrings
     * @constructor
     */
    Controller.$Class("GameController")
        .$provides(["GameStrings"])   //injecting GameStrings (Declared @ eof)
        .$constructor(function (gameStrings) {

            this.gameStrings = gameStrings;
            this.gameData = new Model.GameData();
            this.details = new View.DetailsWindow();
            this.playerPiece = {};

            for (var i = 0; i < this.gameData.players.length; i++) {
                var playerPiece = new View.PlayerPiece(); //add player view
                playerPiece.setColor(this.gameData.players[i].color);
                playerPiece.moveToPosition(1);
                this.playerPiece[this.gameData.players[i].name] = playerPiece;
            }

            //vars
            this.nextChance = null;
            this.currentPlayer = this.gameData.getNextPlayerChance();
            this.details.onDiceClick(this.onRollClick.bind(this));
            this.runGame();
        })
        .$prototype({
            //--@static--
            SLEEP: 1000,

            //runs a single chance with delay
            runGame: function () {
                this.nextChance = setTimeout(this.chance.bind(this), this.SLEEP);
            },

            //single chance
            chance: function () {
                this.hideMessage();
                if (this.currentPlayer.isHuman) {
                    this.showMessageWithButton(this.gameStrings.humanTurn);
                    clearInterval(this.nextChance);
                    return;
                }
                else {
                    this.showMessageWithButton(this.currentPlayer.name + this.gameStrings.turn);
                    this.onRollClick();
                }
            },

            //Process the outcome of the dice throw.
            //Moves player to new position,etc.
            processChance: function (player) {
                this.hideMessage();
                if (player.isStarted) {
                    this.playerPiece[player.name].moveToPosition(player.position);
                }
                else {
                    //add check if player is human
                    this.showMessage(player.name + this.gameStrings.toStart);
                }

                //check for pos has a snake / ladder / none
                var jump = player.checkForJump();
                if (jump) {
                    if (jump.isLadder) {
                        this.showMessage(player.name + this.gameStrings.ladder);
                    }
                    else {
                        this.showMessage(player.name + this.gameStrings.snake);
                    }
                    this.runProcessChance();
                    return;
                }
                //check if game completed
                if (player.isCompleted) {
                    this.showMessage(player.name + this.gameStrings.won);
                    return;
                }
                //should roll again ..??
                if (!player.shouldRollAgain()) {
                    this.currentPlayer = this.gameData.getNextPlayerChance();
                }
                this.runGame();
            },

            //event handler of dice button click
            onRollClick: function (e) {
                if (e) {
                    e.preventDefault();
                }
                var outcome = this.currentPlayer.roleDice();
                this.showMessage(this.currentPlayer.name + "(" + this.currentPlayer.color + ")" + this.gameStrings.rolled + outcome + ".");
                this.runProcessChance();
            },

            //runs processChance with delay
            runProcessChance: function () {
                setTimeout(this.processChance.bind(this, this.currentPlayer), this.SLEEP);
            },

            //shows details board
            showMessage: function (msg) {
                this.details.hideButton();
                this.details.setInfo(msg);
                this.details.show();
            },

            //shows details board without dice button
            showMessageWithButton: function (msg) {
                this.details.showButton();
                this.details.setInfo(msg);
                this.details.show();
            },

            //hides details board
            hideMessage: function () {
                this.details.hide();
            }
        });


    //=============================Injectable Items=================================


    /**
     * GameStrings
     *
     * Contains a list of strings used in the game.
     *
     * @InjectableItem
     * //this item will be available to app and all its sub modules.
     * Read more about "Scoping of an Injectable item." @ https://github.com/anubhavgupta/PowerJS
     *
     */
    module("app").$Injectable("GameStrings", false, {
        ladder: " found a ladder",
        snake: " is attacked by a snake.",
        won: " WON!!!. Hit refresh to restart the game",
        rolled: " rolled ",
        toStart: " need to role 1 or 6 to start.",
        humanTurn: "Your turn. Press 'Roll' button.",
        turn: " turn."
    });

    //--game init--
    new Controller.GameController();
})();
