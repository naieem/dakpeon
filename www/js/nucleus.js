(function(w) {
  'use strict';
  w.modules = ['ionic'];
  getConfiguration();

  /*=============================================
  =      getting configuration from json file
  =============================================*/

  function getConfiguration() {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        var modules = JSON.parse(request.response).modules;
        debugger;
        for (var i = 0; i < modules.length; i++) {
          loadScript(modules[i].name, modules[i].dependency);
          w.modules.push(modules[i].name);
          debugger;
          if ((i+1) == modules.length) {
            w.executeAction('bootstrapDakpeon');
          }
        }
      }
    }

    request.open('Get', 'app.json');
    request.send();
  }

  /*=====  End of configuration  ======*/


  /*----------  loading script  ----------*/

  function loadScript(directoryName, filesArr) {
    debugger;
    for (var i = 0; i < filesArr.length; i++) {
      w.load("modules/" + directoryName + "/" + filesArr[i] + '.js');
    }
  }

})(window);
