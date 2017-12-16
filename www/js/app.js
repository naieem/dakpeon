(function(w) {
  w.registerAction('bootstrapDakpeon', bootstrapDakpeon);

  function bootstrapDakpeon() {
    
    w.load("js/bootstrap.js");
    setTimeout(function() {      
      var t = document.getElementById('load_module');
      angular.element(t).ready(function() {
        angular.bootstrap(document, ['dakpeon']);
      });
    }, 100);
  }

})(window);
