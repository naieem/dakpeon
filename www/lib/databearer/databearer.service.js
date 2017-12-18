(function(w) {
    angular
        .module('databearer')
        .service('dataBearerService', constructor);

    /* @ngInject */
    function constructor($q, $http) {
        // =============================================
        // variable declaration for total service
        // =============================================
        var appconfiguration = {
            navigations: null,
            defaultUrlObj: null,
            sessionExpiredApp: null,
        };
        this.validateSecurityToken = validateSecurityToken;
        this.getAppConfiguration = getAppConfiguration;
        this.generateUrl = generateUrl;
        init();

        // ================================================
        // Initializing service function
        // ================================================
        function init() {

        }

        // =======================================================
        // validating security token
        // =======================================================
        function validateSecurityToken() {
            var deferred = $q.defer();
            getAppConfiguration().then(function(response) {
                debugger;
                if (response) {
                    var configuration = response;
                    $http.post("http://localhost:8083/api/validateSecurityToken")
                        .then(function(tokenResponse) {
                            debugger;
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
            debugger;
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
    }

    constructor.$inject = ['$q', '$http'];
})(window);