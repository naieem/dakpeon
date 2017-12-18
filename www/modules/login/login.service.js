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
                    if (response && response.data)
                        deferred.resolve(response.data); //triggers fnSuccess
                })
                .catch(function(error) {
                    deferred.reject(error); //triggers fnSuccess
                });
            return deferred.promise;
        }
    }

    constructor.$inject = ['$q', '$http'];
})(window);