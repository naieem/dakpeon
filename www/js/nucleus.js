(function(w) {
  'use strict';
  /*----------  by default add ionic as dependency submodule  --------*/

  w.modules = ['ionic'];
  w.navigationMenu = [];
  getConfiguration(); // getting modules configurations


  /*=============================================
  = getting modules mail files
  =============================================*/

  function getConfiguration() {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        var modules = JSON.parse(request.response).modules;

        for (var i = 0; i < modules.length; i++) {
          loadSingleScript(modules[i].name);
          //saving modules array for using in bootstrap file for dependency injection
          w.modules.push(modules[i].name); 
          if ((i + 1) == modules.length) {
            setTimeout(function() {
              loadDependencyFiles(JSON.parse(request.response));
            }, 100);
          }
        }
      }
    }

    request.open('Get', 'app.json');
    request.send();
  }

  /*=====  End of configuration  ======*/

  /*----------  Loading module dependencies  ----------*/
  
  function loadDependencyFiles(configuration) {
    debugger;
    var modules = configuration.modules;
    for (var i = 0; i < modules.length; i++) {
      loadScript(modules[i].name, modules[i].dependency);
      if ((i + 1) == modules.length) {
        getNavigation(configuration.navigations); // getting navigations configurations
      }
    }
  }


  /*----------  loading navigations  ----------*/

  function getNavigation(navigations) {
    debugger;
    for (var i = 0; i < navigations.length; i++) {
      w.navigationMenu.push(navigations[i]);
      /*----------  when all the modules are loaded  ----------*/
      if ((i + 1) == navigations.length) {
        debugger;
        w.executeAction('bootstrapDakpeon');
      }
      /*----------  all the domules are loaded  ----------*/
    }
  }


  /**
  
  	Loading script to DOM:
  	- Directory name from where files need to load
  	- Array of files name to load
  
   */

  function loadSingleScript(filesName) {
    w.load("modules/" + filesName + "/" + filesName + '.js');
  }

  /**
  
  	Loading script to DOM:
  	- Directory name from where files need to load
  	- Array of files name to load
  
   */

  function loadScript(directoryName, filesArr) {

    for (var i = 0; i < filesArr.length; i++) {
      debugger;
      w.load("modules/" + directoryName + "/" + filesArr[i] + '.js');
    }
  }

})(window);
