(function(){

    //view module
    var View =  module("app.view");

    /**
     * ViewGenerator
     * Generates view elements.
     *
     * @constructor
     */
    View.$Class("ViewGenerator")
        .$provides(["TemplateManager","$","GridColorClasses"])// injects TemplateManager,$,GridColorClasses
        .$constructor(function(templMan,$,colorClasses){
            this.createGrid(templMan,$,colorClasses);
            this.centerBoard($);
            this.handleEvents(templMan,$);
        })
        .$prototype({
            rows:10,
            cols:10,

            //generates the grid
            createGrid:function(templMan,$,colors){
                var $boardCont = $(".board-container").node[0];
                for(var i=0;i<this.rows;i++){
                    var $row = templMan.getTemplate("row").row;
                    for(var j=0;j<this.cols;j++){
                        var $col = templMan.getTemplate("col").col;
                        if(j%2==0){
                            $($col).addClass(colors[(parseInt(j/2)+i)%colors.length]);
                        }
                        $row.appendChild($col);
                    }
                    $boardCont.appendChild($row);
                }
            },

            //creates a player piece
            createPlayerPiece:function(templMan,$){
                var $player =  templMan.getTemplate("player").player;
                var $playerContainer = $(".players-container").node[0];
                $playerContainer.appendChild($player);
                return $player;
            },

            getJustifiedDim:function(imageWidth,imageHeight,containerWidth,containerHeight){
                var ratio = parseFloat(imageHeight/imageWidth);

                if((containerWidth*ratio) <= containerHeight){
                    return {
                        width:containerWidth,
                        height:containerWidth*ratio
                    }
                }
                else{
                    return {
                        width:containerHeight/ratio,
                        height:containerHeight
                    }
                }
            },

            //centers the board
            centerBoard:function($){
                var $screen = $(".screen").node[0];
                var $board = $(".board").node[0];
                var $screen = $(".screen").node[0];

                //adjust height and width
                var screenHeight = $screen.offsetHeight;
                var screenWidth = $screen.offsetWidth;
                var lowerDim = (screenWidth<screenHeight)?screenWidth:screenHeight;
                var newDim = this.getJustifiedDim(lowerDim,lowerDim,screenWidth,screenHeight);

                $board.style.height = newDim.height +"px";
                $board.style.width = newDim.width + "px";

                //adjust margins
                $board.style.marginTop = (screenHeight - newDim.height)/2 + "px";
                $board.style.marginLeft = (screenWidth-newDim.width)/2 + "px";
            },

            //adds detailsWindow
            detailsWindow:function(templMan,$){
                var details = templMan.getTemplate("detailsWindow");
                var $screen = $(".screen").node[0];
                $screen.appendChild(details.detailsWindow);
                return details;
            },

            //handles resize event
            handleEvents:function(tempMan,$){
                var self = this;
                window.onresize = function(){
                    self.centerBoard($);
                }
            }
        });

    /**
     * PlayerPiece
     * Player's piece helper class, performs operations related to player's piece view.
     *
     * @constructor
     */
    View.$Class("PlayerPiece")
        .$provides(["ViewGenerator","TemplateManager","$"])// injects ViewGenerator,TemplateManager,$
        .$constructor(function(viewGen,templMan,$){
            this.viewGen = viewGen;
            this.$playerPeace = viewGen.createPlayerPiece(templMan,$);
            this.$player = $(this.$playerPeace);
        })
        .$prototype({

            //moves player's piece to the given position.
            moveToPosition:function(pos){
                var index = pos-1;
                var rowCol = this.getRowColFromIndex(index);
                this.$playerPeace.style.top = rowCol.row*10 +"%";
                this.$playerPeace.style.left = rowCol.col*10 +"%";
            },

            //sets color of the player's piece.
            setColor:function(color){
                this.$player.addClass(color);
            },

            //return row and column from board index
            getRowColFromIndex:function(index){
                var ones = index%this.viewGen.cols,
                    tens = parseInt(index/this.viewGen.rows),
                    col;

                if(tens !==0 && tens%2!==0){
                    // if !even
                    col = (this.viewGen.cols - 1) - ones;
                }
                else{
                    // if even
                    col = ones;
                }

                return {
                    row:(this.viewGen.rows - 1) - tens,
                    col:col
                }
            }
        });

    /**
     * DetailsWindow
     * Shows a message box,optionally with a dice button.
     *
     * @constructor
     */
    View.$Class("DetailsWindow")
        .$provides(["ViewGenerator","TemplateManager","$"])// injects ViewGenerator,TemplateManager,$
        .$constructor(function(viewGen,templMan,$){
            var details = viewGen.detailsWindow(templMan,$);
            this.$details = details.detailsWindow;
            this.$info =  details.info;
            this.$dice = details.dice;
        })
        .$prototype({
            show:function(){
                this.$details.style.display = "block";
            },
            hide:function(){
                this.$details.style.display = "none";
            },
            showButton:function(){
                this.$dice.style.display = "";
            },
            hideButton:function(){
                this.$dice.style.display = "none";
            },
            setInfo:function(text){
                this.$info.innerHTML = text;
            },
            onDiceClick:function(fn){
                this.$dice.addEventListener("click",fn);
            }
        });


    //===================== Injectables ====================

    View.$Injectable("TemplateManager",true,View.TemplateManager);

    //creates a functional wrapper for Dom Manager.
    View.$Injectable("$",false,function(node){
          return new  View.DomMan(node);
    });

    View.$Injectable("ViewGenerator",true,View.ViewGenerator);

    View.$Injectable("GridColorClasses",false,[
        "green",
        "lightGreen",
        "yellow",
        "pink",
        "blue",
        "darkGreen",
        "lightPurple",
        "purple"
    ]);

})();

