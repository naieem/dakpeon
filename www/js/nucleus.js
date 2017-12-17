(function(w) {
  'use strict';

  // ==============================================
  // main variables to share between windows
  // ==============================================

  w.modules = ['ionic']; // by default add ionic as dependency submodule 
  w.navigationMenu = []; // arrays of all navigation configuration
  w.appName = ''; // main appname and main module name to be used in the bootstrap
  w.defaultUrl = ""; // main redirect url for ui-router default url link
  getConfiguration(); // getting modules configurations


  // =================================================
  // getting modules main configuration from app.json
  // =================================================

  function getConfiguration() {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (request.readyState === 4) {

        /*----------  getting app configuration   ----------*/
        var appConfiguration = JSON.parse(request.response);
        /*----------  assigning appname or main module  ----------*/
        w.appName = appConfiguration.appName;
        /*----------  main redirect url for ui-router default url link ----------*/
        w.defaultUrl = generateDefaultUrl(appConfiguration);
        // w.defaultUrl = appConfiguration.defaultUrl;
        /*----------  all the modules to load  ----------*/
        var modules = appConfiguration.modules;

        for (var i = 0; i < modules.length; i++) {
          loadSingleScript(modules[i].name);
          // ===============================
          // saving modules for using
          // in the bootstrap file
          // as dependency
          // ===============================          
          w.modules.push(modules[i].name);
          // =================================
          // if modules main files are loaded
          // this is called to load their
          // dependend files
          // =================================
          if ((i + 1) == modules.length) {
            setTimeout(function() {
              loadDependencyFiles(appConfiguration);
            }, 100);
          }
        }
      }
    }

    request.open('Get', 'app.json');
    request.send();
  }

  /*=====  End of configuration  ======*/

  // =========================================================
  // generating default url from defaultApps object
  // =========================================================
  function generateDefaultUrl(appConfiguration) {
    var url = "";
    for (var i = 0; i < appConfiguration.navigations.length; i++) {
      if (appConfiguration.navigations[i].navigationName == appConfiguration.defaulApp.name) {
        url += appConfiguration.navigations[i].url;
        if (appConfiguration.defaulApp.children) {
          for (var j = 0; j < appConfiguration.navigations[i].Children.length; j++) {
            if (appConfiguration.navigations[i].Children[j].navigationName == appConfiguration.defaulApp.children) {
              url += appConfiguration.navigations[i].Children[j].url;
            }
          }
        }
      }
    }
    debugger;
    return url;
  }

  // =============================================
  // function to load dependent files of
  // main config modules
  // =============================================
  function loadDependencyFiles(configuration) {

    var modules = configuration.modules;
    for (var i = 0; i < modules.length; i++) {
      loadScript(modules[i].name, modules[i].dependency);
      if ((i + 1) == modules.length) {
        getNavigation(configuration.navigations); // getting navigations configurations
      }
    }
  }

  // ================================================
  // storing navigation values for using in routing
  // and bootstrapping call to start execution
  // of the main module
  // ================================================
  function getNavigation(navigations) {

    for (var i = 0; i < navigations.length; i++) {
      w.navigationMenu.push(navigations[i]);
      // ===========================================
      // when all the module and navigations are
      // loaded then bootstrap the main application
      // ===========================================
      if ((i + 1) == navigations.length) {
        w.executeAction('bootstrap');
      }
    }
  }


  /*----------  loading single script files  ----------*/


  function loadSingleScript(fileAndFolderName) {
    w.load("modules/" + fileAndFolderName + "/" + fileAndFolderName + '.config.js');
  }

  /*----------  loading array of script files from given directory  ----------*/


  function loadScript(directoryName, filesArr) {

    for (var i = 0; i < filesArr.length; i++) {

      w.load("modules/" + directoryName + "/" + filesArr[i] + '.js');
    }
  }

})(window);
