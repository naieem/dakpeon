(function(w) {
    angular
        .module('databearer')
        .service('dataBearerService', constructor);

    /* @ngInject */
    function constructor($q, $http, $rootScope, $location, $state) {
        // =============================================
        // variable declaration for total service
        // =============================================
        var appconfiguration = {
            navigations: null,
            defaultUrlObj: null,
            sessionExpiredApp: null,
        };
        var firstTimeVisit = true;
        this.validateSecurityToken = validateSecurityToken;
        this.getAppConfiguration = getAppConfiguration;
        this.generateUrl = generateUrl;
        this.setAuthenticationToken = setAuthenticationToken;
        init();

        // ================================================
        // Initializing service function
        // ================================================
        function init() {
            $rootScope.$on("$stateChangeStart", OnRouteChange);
        }

        // ================================================
        // function to call if navigation menu changes
        // ================================================

        function OnRouteChange(event, toState, toParams, fromState, fromParams) {
            if (!firstTimeVisit) {
                validateSecurityToken().then(function(tokenResponse) {
                    var url = "";
                    if (!tokenResponse.status) {

                        url = generateUrl(tokenResponse.sessionExpiredApp);
                        $location.path(url);
                    } else {
                        var toStr = toState.name.split('.');

                        if (toStr[0] == appconfiguration.sessionExpiredApp.name && toStr[1] == appconfiguration.sessionExpiredApp.children)
                            $state.go(fromState.name);
                    }

                }).catch(function(error) {
                    console.log(error);
                });
            } else {
                firstTimeVisit = false;
            }
        }

        // =======================================================
        // validating security token
        // =======================================================
        function validateSecurityToken() {
            var deferred = $q.defer();
            getAppConfiguration().then(function(response) {

                if (response) {
                    var configuration = response;
                    $http.post("http://localhost:8083/api/validateSecurityToken")
                        .then(function(tokenResponse) {

                            configuration.status = tokenResponse.data.status;
                            deferred.resolve(configuration); //triggers fnSuccess
                        })
                        .catch(function(response) {
                            deferred.reject(response); //triggers fnerror
                        });
                }
            }).catch(function(error) {
                console.log("error gettin app configuration", error);
            });
            return deferred.promise;
        }

        // =======================================================
        // Getting app configuration from app.json file
        // =======================================================
        function setAppConfiguration() {
            return $http.get("../../app.json");
        }

        // ===========================================================
        // returning appconfiguration for using in the global purpose
        // ===========================================================
        function getAppConfiguration() {
            var deferred = $q.defer();
            setAppConfiguration().then(function(response) {
                if (response && response.data) {
                    appconfiguration.navigations = response.data.navigations;
                    appconfiguration.defaultUrlObj = response.data.defaulApp;
                    appconfiguration.sessionExpiredApp = response.data.sessionExpiredApp;
                    deferred.resolve(appconfiguration); //triggers fnSuccess
                } else {
                    console.log("Appconfiguration is not ready");
                }
            }, function(error) {
                console.log(error);
                deferred.reject(error); //triggers fnerror
            });
            return deferred.promise;
        }

        // =========================================================
        // generating  url from defaultApps object
        // =========================================================
        function generateUrl(navigationObject) {

            var url = "";
            for (var i = 0; i < appconfiguration.navigations.length; i++) {
                if (appconfiguration.navigations[i].navigationName == navigationObject.name) {
                    url += appconfiguration.navigations[i].url;
                    if (navigationObject.children) {
                        for (var j = 0; j < appconfiguration.navigations[i].Children.length; j++) {
                            if (appconfiguration.navigations[i].Children[j].navigationName == navigationObject.children) {
                                url += appconfiguration.navigations[i].Children[j].url;
                            }
                        }
                    }
                }
            }

            return url;
        }

        function setAuthenticationToken(token) {
            var deferred = $q.defer();
            localStorage.setItem('token', token);
            $rootScope.token = token;
            deferred.resolve(token);
            return deferred.promise;
        }
    }

    constructor.$inject = ['$q', '$http', '$rootScope', '$location', '$state'];
})(window);