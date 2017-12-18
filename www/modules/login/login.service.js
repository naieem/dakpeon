(function(w) {
    angular
        .module('login')
        .service('loginService', constructor);

    /* @ngInject */
    function constructor($q, $http) {
        this.login = login;

        function login(userData) {
            var deferred = $q.defer();
            $http.post("http://localhost:8083/api/login", userData)
                .then(function(response) {
                    deferred.resolve(response); //triggers fnSuccess
                })
                .catch(function(response) {
                    deferred.reject(response); //triggers fnSuccess
                });
            return deferred.promise;
        }
    }

    constructor.$inject = ['$q', '$http'];
})(window);