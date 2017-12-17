(function(w) {
  'user strict';

  // =============================================
  //    Bootstrapping the main Module            
  // =============================================

  angular.module(w.appName, w.modules)

    .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });
    })

    .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
      $httpProvider.interceptors.push('authorizationInjector');
      configureRouting($stateProvider);
      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise(w.defaultUrl);

    })

    .factory('authorizationInjector', function() {
      var token = localStorage.getItem("token");
      var authorizationInjector = {
        request: function(config) {
          if (token) {
            config.headers['Authorization'] = token;
          }
          return config;
        }
      };
      return authorizationInjector;
    });

  /*=====  End of bootstrapping main module  ======*/


  /*----------  Configuring routing  ----------*/

  function configureRouting($stateProvider) {
    debugger;
    for (var i = 0; i < w.navigationMenu.length; i++) {
      if (w.navigationMenu[i].isPublished)
        generateStateDefinition(w.navigationMenu[i], $stateProvider);
    }
  }


  // =================================================================
  // generating parent states
  // =================================================================

  function generateStateDefinition(navigationInfo, $stateProvider) {
    var templateUrl = "";
    var controller = generateController(navigationInfo);
    if (navigationInfo.appView !== "") {
      templateUrl = "modules/" + navigationInfo.appName + "/views/" + navigationInfo.appView + ".html";
    } else {
      templateUrl = "modules/" + navigationInfo.appName + "/views/" + navigationInfo.appName + ".html";
    }
    var stateName = navigationInfo.navigationName;
    var stateDefinition = {
      "name": stateName,
      "url": navigationInfo.url,
      "abstruct": navigationInfo.hasChild ? navigationInfo.hasChild : false,
      "templateUrl": templateUrl,
      "controller": controller
    }
    debugger;
    // ================================================================
    // setting state
    // statename:string
    // stateDefinition:Object
    // ================================================================
    $stateProvider.state(stateName, stateDefinition);
    if (navigationInfo.Children && navigationInfo.Children.length)
      generateStateForChildren(navigationInfo, $stateProvider);
  }

  // ==================================================================
  // generating child states for the parent routes
  // ==================================================================
  function generateStateForChildren(navigationInfo, $stateProvider) {
    for (var i = 0; i < navigationInfo.Children.length; i++) {
      if (navigationInfo.Children[i].isPublished) {
        var templateUrl = "";
        var controller = generateController(navigationInfo.Children[i]);
        if (navigationInfo.Children[i].appView !== "") {
          templateUrl = "modules/" + navigationInfo.Children[i].appName + "/views/" + navigationInfo.Children[i].appView + ".html";
        } else {
          templateUrl = "modules/" + navigationInfo.Children[i].appName + "/views/" + navigationInfo.Children[i].appName + ".html";
        }
        var stateName = navigationInfo.navigationName + "." + navigationInfo.Children[i].navigationName;
        var stateDefinition = {
          "name": stateName,
          "url": navigationInfo.Children[i].url,
          "views": {
            "menuContent": {
              "templateUrl": templateUrl,
              "controller": controller
            }
          }
        }
        debugger;
        // ================================================================
        // setting state
        // statename:string
        // stateDefinition:Object
        // ================================================================
        $stateProvider.state(stateName, stateDefinition);
      }
    }
  }
  // =================================================
  // generating controller name from navigationinfo
  // =================================================
  function generateController(navigationInfo) {
    var controller = "";
    if (navigationInfo.appView !== "") {
      var splittedWords = navigationInfo.appView.split('-');
      controller = splittedWords[0];
      for (var i = 1; i < splittedWords.length; i++) {
        controller += uppercaseStringsFirstLetter(splittedWords[i]);
      }
    } else {
      var splittedWords = navigationInfo.appName.split('-');
      controller = splittedWords[0];
      for (var i = 1; i < splittedWords.length; i++) {
        controller += uppercaseStringsFirstLetter(splittedWords[i]);
      }
    }
    return controller + "Controller";
  }
  // =================================================
  // uppercasing firstletter of the string
  // =================================================
  function uppercaseStringsFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

})(window);
