(function(w) {
  w.registerAction('bootstrapDakpeon', bootstrapDakpeon);

  function bootstrapDakpeon() {
    debugger;
    w.load("js/bootstrap.js");
    var t = document.getElementById('load_module');
    angular.element(t).ready(function() {
      angular.bootstrap(document, ['dakpeon']);
    });
  }

})(window);
