(function(){

    /**
     * TemplateManager
     * Creates copy/clone of templates and provides them in a key value pair.
     *
     * @injected - GameStrings
     * @constructor
     */
    module("app.view").$Class("TemplateManager")
        .$provides(["TemplateContainerID"]) //injects TemplateContainerID {Injects Undefined if not defined}
        .$constructor(function(templateContainerId){
            templateContainerId = templateContainerId || "templates"; //default template container container id
            this.$templateContainer = document.getElementById(templateContainerId);
            this.fetchAllTemplates();
        })
        .$prototype({
            template:{}, //static

            //creates copy of all templates available in "#templates" || userProvided node.
            fetchAllTemplates:function(){
                for(var i=0;i<this.$templateContainer.children.length;i++){
                    var template = this.$templateContainer.children[i];
                    if(template.getAttribute("data-id")!=""){
                        var cloneNode = template.cloneNode(true);
                        cloneNode.removeAttribute("data-id");
                        this.template[template.getAttribute("data-id")] = cloneNode;
                    }
                }
            },

            /**
             * Returns an object containing data-ref as keys and corresponding cloned nodes
             *
             * @param templateName - name of template {data-id}
             * @returns {Object}
             */
            getTemplate:function(templateName) {
                var node =  this.template[templateName];
                if(node){
                    node =  node.cloneNode(true);
                    return this.getReferences(node,{});
                }
            },

            getReferences:function(node,referencesObj){
                var key = node.getAttribute("data-ref");
                if(key){
                    referencesObj[key] = node;
                    node.removeAttribute("data-ref");
                }
                for(var i=0;i<node.children.length;i++){
                    this.getReferences(node.children[i],referencesObj)
                }
                return referencesObj;
            }
        });
})();


