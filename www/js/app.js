(function(w) {
    w.registerAction('bootstrap', bootstrapDakpeon);

    function bootstrapDakpeon() {
        // ==========================================
        // bootstrapping main module and application
        // ==========================================
        w.load("js/bootstrap.js").then(function(response) {
            if (response && response.success) {
                // ================================================================
                // some pause for making dom ready to bootstrap application module
                // ================================================================
                var moduleContainer = document.getElementById('load_module');
                angular.element(moduleContainer).ready(function() {
                    angular.bootstrap(document, [w.appName]);
                });
            }
        });
    }

})(window);