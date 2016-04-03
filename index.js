var async       = require('async')
;



function plugin(schema) {
    /****************************************************************
     * PRE HOOKS
     * These hooks run before an instance has been updated
     * Puesto que el `iteratee` consiste meramente en la ejecucion del 
     * metodo pertinente en cada una de las iteraciones, los hooks 
     * agregados a la coleccion de `pre-create` deben adecuarse a la 
     * signatura `function(doc, cb)`
     */
    schema.preCreateMethods = [];
    schema.preCreate = function(fn){ schema.preCreateMethods.push(fn) };
    schema.methods.runPreCreateMethods = function(methods, doc, callback){
        async.eachSeries(
            methods,
            function(method, signal){ method(doc, signal) }, 
            callback
        );
    };
    
    
    
    /****************************************************************
     * POST HOOKS
     * These hooks run after an instance has been updated
     * Puesto que el `iteratee` consiste meramente en la ejecucion del 
     * metodo pertinente en cada una de las iteraciones, los hooks 
     * agregados a la coleccion de `pre-create` deben adecuarse a la 
     * signatura `function(doc, cb)`
     */
    schema.postCreateMethods = [];
    schema.postCreate = function(fn){ schema.postCreateMethods.push(fn) };
    schema.methods.runPostCreateMethods = function(methods, doc){
        async.eachSeries(
            methods,
            function(method, signal){ method(doc, signal) }, 
            function(err){
                if (err){ throw err; }
            }
        );
    };
    
    
    
    /****************************************************************
     * SETUP
     * En el seno de las funciones definidas, `DOC` se refiere al 
     * documento mismo sobre el cual operan las `hooks`. 
     */
    schema.pre('validate', function(next){
            const DOC = this;
            DOC._wasNew = DOC.isNew;
            if (DOC.isNew) DOC.runPreCreateMethods(schema.preCreateMethods, DOC, next);
            else return next();
        }
    );
    schema.post('save', function(){
            const DOC = this;
            if (DOC._wasNew) DOC.runPostCreateMethods(schema.postCreateMethods, DOC);
            else return;
        }
    );
}



module.exports = plugin;