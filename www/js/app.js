(function(w) {
  w.registerAction('bootstrap', bootstrapDakpeon);

  function bootstrapDakpeon() {

    w.load("js/bootstrap.js");
    setTimeout(function() {
      var moduleContainer = document.getElementById('load_module');
      angular.element(moduleContainer).ready(function() {
        angular.bootstrap(document, [w.appName]);
      });
    }, 100);
  }

})(window);
