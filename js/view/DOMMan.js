/**
 * Light Weight ClassList Alternate: IE8+
 * Available Methods:
 * 1) index() - return index of current node.
 * 2) addClass()
 * 3) removeClass()
 * 4) hasClass()
 * 5) getClasses()  - returns an array of classes.
 */

(function(){
    //very basic utility to add class
    var View =module("app.view");

    View.$Class("DomMan")
        .$constructor(function(node){
            if(typeof node == "string"){
                var selector  =node.slice(1);
                if(node.charAt(0) == "#"){
                    node = document.getElementById(selector);
                }
                else if(node.charAt(0) == "."){
                    node = document.getElementsByClassName(selector);
                }
                else{
                    node = document.getElementsByTagName(selector);
                }
            }
            this.node = node;
        })
        .$prototype({
            getClasses:function(className){
                var className = className || this.node.className;
                return className.split(/\s+/g);
            },
            addClass:function(className){
                var presentClasses = this.getClasses();
                var toAddClasses = this.getClasses(className);
                for(var i=0;i<toAddClasses.length;i++){
                    if(!~presentClasses.indexOf(toAddClasses[i])){
                        presentClasses.push(toAddClasses[i]);
                    }
                }
                this.node.className = presentClasses.join(" ");
                return this;
            },
            removeClass:function(className){
                if(className){
                    var presentClasses = this.getClasses();
                    var toRemoveClasses = this.getClasses(className);
                    for(var i=0;i<toRemoveClasses.length;i++){
                        var index = presentClasses.indexOf(toRemoveClasses[i]);
                        if(~index){
                            presentClasses.splice(index,1);
                        }
                    }
                    this.node.className = presentClasses.join(" ");
                }
                else{
                    //clear if no class name is provided.
                    this.node.className = "";
                }
                return this;
            },
            hasClass:function(className){
                var presentClasses = this.getClasses();
                var toFind = this.getClasses(className);
                var returnVal = true;
                for(var i=0;i<toFind.length;i++){
                    if(!~presentClasses.indexOf(toFind[i])){
                        returnVal = false;
                        break;
                    }
                }
                return returnVal;
            },
            index:function () {
                var parent = this.node.parentNode;
                if (parent) {
                    var index = 0;
                    var children = parent.children;
                    while (children[index] != this.node) {
                        index++;
                    }
                    return index;
                }
                return -1;
            }
        });

})();


