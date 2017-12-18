(function(w) {
  w.registerAction('bootstrap', bootstrapDakpeon);

  function bootstrapDakpeon() {
    // ==========================================
    // bootstrapping main module and application
    // ==========================================
    w.load("js/bootstrap.js");
    // ================================================================
    // some pause for making dom ready to bootstrap application module
    // ================================================================
    setTimeout(function() {
      var moduleContainer = document.getElementById('load_module');
      angular.element(moduleContainer).ready(function() {
        angular.bootstrap(document, [w.appName]);
      });
    }, 1000);
  }

})(window);
