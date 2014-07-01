(function(){

    //model module
    var Model = module("app.model");

    /**
     * PlayerData
     * Creates, stores and performs player related operations.
     *
     * @constructor
     */
    Model.$Class("PlayerData")
        .$provides(["Rules"]) //Injected rules
        .$constructor(function(rules){

            //defaults
            this.isHuman = false;
            this.color = "red";
            this.rules = rules;
            this.position = 1;
            this.isStarted = false;
            this.isCompleted = false;
            this.outcome = -1;
            this.name="";
        })
        .$prototype({
            //@static
            MAX_DICE:6, //max possible dice value

            roleDice:function(){
                var outcome = parseInt(Math.random()*this.MAX_DICE +1);
                this.outcome = outcome;

                if(!this.isStarted){
                    if(this.rules.toStart[0] == outcome || this.rules.toStart[1] == outcome){
                        this.isStarted = true;
                    }
                    return outcome;
                }

                if(this.position+outcome <= this.rules.MAX_POS){
                    this.position += outcome;
                }

                if(this.position == this.rules.MAX_POS){
                    this.isCompleted = true;
                }
                return outcome;
            },

            //checks if player should role again or not.
            shouldRollAgain:function(){
                return this.outcome == this.rules.rollAgainOn;
            },

            //checks if current position of this player is a ladder position or snake position or not.
            checkForJump:function(){
                var newPos = this.rules.jumps[this.position];

                if(newPos){
                    var oldPos = this.position;
                    this.position = newPos.to;
                    return {
                        to:newPos.to,
                        isLadder:newPos.to > oldPos
                    }
                }
                return false;
            },

            setHumanStatus:function(isHuman){
                this.isHuman = isHuman;
            },

            setPlayerName:function(name){
                this.name = name;
            },

            setColor:function(color){
                this.color = color;
            }
        });

    /**
     * GameData
     * Creates Players and performs game related operations.
     *
     * @constructor
     */
    Model.$Class("GameData")
        .$provides(["Rules"])    //Injected rules
        .$constructor(function(rules){
            this.rules = rules;
            this.players =[];   // PlayerData ArrayList
            this.createPlayers();
            this.currentSelectedPlayer =-1;
        })
        .$prototype({
            createPlayers:function(){
                for(var i=0;i<this.rules.players.length;i++){
                    var player = new Model.PlayerData();
                    player.setHumanStatus(this.rules.players[i].isHuman);
                    player.setPlayerName(this.rules.players[i].name);
                    player.setColor(this.rules.players[i].color);
                    this.players.push(player);
                }
            },
            //get next available player
            getNextPlayerChance:function(){
                this.currentSelectedPlayer =(this.currentSelectedPlayer+1)% this.players.length;
                return this.players[this.currentSelectedPlayer];
            }
        });




    //================================== Injectables ===============================
    /**
     * Rules
     * Static Game rules
     * @Injectable
     */
    Model.$Injectable("Rules",false,{
        jumps:{     //map of snakes and ladder position.
            3:{
                to:45
            },
            14:{
                to:33
            },
            34:{
                to:10
            },
            43:{
                to:81
            },
            67:{
                to:19
            },
            68:{
                to:95
            },
            92:{
                to:51
            },
            99:{
                to:15
            }
        },
        toStart:[6,1], //player can start game on 1,6
        rollAgainOn:6, //player will get another chance on 6
        MAX_POS:100, // MAX possible board position.
        players:[ // static player details.
            {
                name:"You",
                isHuman:true,
                color:"blue"
            },
            {
                name:"Anshul",
                isHuman:false,
                color:"red"
            },
            {
                name:"Samakash",
                isHuman:false,
                color:"yellow"
            },
            {
                name:"Shalini",
                isHuman:false,
                color:"green"
            }
        ]
    });

})();
