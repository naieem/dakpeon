(function(w) {
    angular
        .module('login')
        .controller('loginController', constructor);

    /* @ngInject */
    function constructor($location, loginService) {
        var vm = this;
        vm.doLogin = doLogin;


        function doLogin(userData) {
            loginService.login(userData).then(function(response) {
                if (response && response.status) {
                    loginService.setAuthenticationToken(response.token);
                    $location.path("/menu/home");
                }

            }).catch(function(error) {

                console.log(error);
            });
        }
    }

    constructor.$inject = ["$location", "loginService"];
})(window);