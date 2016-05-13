var async       = require('async')
;



function plugin(schema) {
    /****************************************************************
     * wasNew
     * Campo cuyo examen permite determinar si los metodos definidos
     * mediante schema#preCreate() deben ser ejecutados (documentos 
     * recience creados) o no (documentos anteriormente creados y 
     * ahora actualizados)
     */
    schema.add({"_wasNew": Boolean});
    
    
    
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
    schema.methods.runPreCreateMethods = runPreCreateMethods;
    
    
    
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
    schema.methods.runPostCreateMethods = runPreCreateMethods;
    
    
    
    /****************************************************************
     * HOOKS TRIGGERING SETUP 
     * Puesto que no existe ninguna funcion 'create' que pueda ser 
     * 'escuchada' al estilo de `init`, `save`... la forma de provocar 
     * el desencadenamiento de los hooks asociados al evento `create` 
     * es evaluar si se trata de un documento de nueva creacion, y si 
     * lo es, ejecutar los hooks `pre-` en el seno a su vez de un hook 
     * `pre-validate` y los `post-` de un hook `post-save`
     * 
     * En el seno de las funciones definidas, `DOC` se refiere al 
     * documento mismo sobre el cual operan las `hooks`. 
     */
    schema.pre('validate', function(next){
            const DOC = this;
            DOC._wasNew = DOC.isNew;
            if (DOC.isNew) runPreCreateMethods(schema.preCreateMethods, DOC, next);
            else return next();
        }
    );
    schema.post('save', function(doc){
            if (doc._wasNew) runPostCreateMethods(schema.postCreateMethods, doc);
            else return;
        }
    );
}



function runPreCreateMethods(methods, doc, callback){
    async.eachSeries(
        methods,
        function(method, signal){ method.bind(doc)(signal) }, 
        callback
    );
}



function runPostCreateMethods(methods, doc){
    methods.forEach(function(method){ 
            method(doc, function(){return});
        }
    );
}



module.exports = plugin;