(function(w) {
  'user strict';
  /*=============================================
  =    Bootstrapping the main Module            =
  =============================================*/

  angular.module('dakpeon', w.modules)

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
      $urlRouterProvider.otherwise('/app/login');

    }).factory('authorizationInjector', function() {
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
  
  function configureRouting($stateProvider){
    for (var i = 0; i < w.navigationMenu.length; i++) {
        //if (!$state.get(w.navigationMenu[i].name)) {
        $stateProvider.state(w.navigationMenu[i].name, w.navigationMenu[i].definition);
        if (w.navigationMenu[i].Children) {
          for (var j = 0; j < w.navigationMenu[i].Children.length; j++) {
            debugger;
            $stateProvider.state(w.navigationMenu[i].Children[j].name, w.navigationMenu[i].Children[j].definition);
          }
        }
      }
  }

})(window);
