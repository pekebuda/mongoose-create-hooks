var async       = require('async')
;



function plugin(schema) {
    //Pre-Save Setup
    schema.pre('validate', function(next){
            var self = this;
            this._wasNew = this.isNew;
            if (this.isNew) {
                this.runPreMethods(schema.preCreateMethods, self, function(){
                        next();
                    }
                );
            }
        }
    );
    
    //Post-Save Setup
    schema.post('save', function(){
            var self = this;
            if (this._wasNew) {
                this.runPostMethods(schema.postCreateMethods, self);
            }
        }
    );




  /**************************************************************
   * Pre-Hooks
   * These hooks run before an instance has been created
   */
    schema.methods.runPreMethods = function(methods, self, callback){
        async.eachSeries(
            methods,
            function(fn, cb) {
                fn(self, cb);
            }, 
            function(err){
                if (err){ throw err; }
                callback();
            }
        );
    };
    
    //Pre-Create Methods
    schema.preCreateMethods = [];
    //
    schema.preCreate = function(fn){
        schema.preCreateMethods.push(fn);
    };
    
    
    
    /***********************************************************
     * Post-Hooks
     * These hooks run after an instance has been created
     */
    schema.methods.runPostMethods = function(methods, self){
        async.eachSeries(
            methods,
            function(fn, cb) {
                fn(self, cb);
            }, 
            function(err){
                if (err){ throw err; }
            }
        );
    };
    
    // Post-Create Methods
    schema.postCreateMethods = [];
    //
    schema.postCreate = function(fn){
        schema.postCreateMethods.push(fn);
    };
}



module.exports = plugin;