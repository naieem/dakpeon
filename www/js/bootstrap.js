(function(w) {
    'user strict';

    // =============================================
    //    Bootstrapping the main Module            
    // =============================================

    angular.module(w.appName, w.modules)

    .run(function($ionicPlatform, dataBearerService, $location) {
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
            // ===================================================
            // main call for validated token and get decision
            // for redirection of route
            // ===================================================
            tokenValidationAndRedirection(dataBearerService, $location);
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


    // ===================================================
    // configuring all routes for the application
    // returns configured states and routes
    // ===================================================

    function configureRouting($stateProvider) {

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
        var controller = generateController(navigationInfo); // generating controller name
        if (navigationInfo.appView !== "") {
            templateUrl = "modules/" + navigationInfo.appName + "/views/" + navigationInfo.appView + ".html";
        } else {
            templateUrl = "modules/" + navigationInfo.appName + "/views/" + navigationInfo.appName + ".html";
        }
        var stateName = navigationInfo.navigationName; // generating statename
        // ==================================================================
        // creating definition object for state parameter
        // ==================================================================
        var stateDefinition = {
            "name": stateName,
            "url": navigationInfo.url,
            "abstruct": navigationInfo.hasChild ? navigationInfo.hasChild : false,
            "templateUrl": templateUrl,
            "controller": controller,
            controllerAs: 'vm'
        }

        // ================================================================
        // setting children state
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
                var controller = generateController(navigationInfo.Children[i]); // generating controller name
                if (navigationInfo.Children[i].appView !== "") {
                    templateUrl = "modules/" + navigationInfo.Children[i].appName + "/views/" + navigationInfo.Children[i].appView + ".html";
                } else {
                    templateUrl = "modules/" + navigationInfo.Children[i].appName + "/views/" + navigationInfo.Children[i].appName + ".html";
                }
                var stateName = navigationInfo.navigationName + "." + navigationInfo.Children[i].navigationName; // generating statename
                // ==================================================================
                // creating definition object for state parameter
                // ==================================================================
                var stateDefinition = {
                    "name": stateName,
                    "url": navigationInfo.Children[i].url,
                    "views": {
                        "menuContent": {
                            "templateUrl": templateUrl,
                            "controller": controller,
                            controllerAs: 'vm'
                        }
                    }
                }

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
    // returns(controllername:string)
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
    // return string
    // =================================================
    function uppercaseStringsFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }
    // ===================================================
    // main call for validated token and get decision
    // for redirection of route
    // ===================================================
    function tokenValidationAndRedirection(dataBearerService, $location) {
        //dataBearerService.getAppConfiguration().then(function(response) {
        //if (response) {
        dataBearerService.validateSecurityToken().then(function(tokenResponse) {
            var url = "";
            if (!tokenResponse.status) {
                url = dataBearerService.generateUrl(tokenResponse.sessionExpiredApp);
            } else {
                url = dataBearerService.generateUrl(tokenResponse.defaulApp);
            }
            debugger;
            $location.path(url);
        }).catch(function(error) {
            console.log(error);
        });;
        //}
        //})
    }

})(window);