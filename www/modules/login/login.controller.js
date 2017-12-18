(function(w) {
    angular
        .module('login')
        .controller('loginController', constructor);

    /* @ngInject */
    function constructor(loginService) {
        var vm = this;
        vm.doLogin = doLogin;


        function doLogin(userData) {
            loginService.login(userData).then(function(response) {
                debugger;
            }).catch(function(error) {
                debugger;
                console.log(error);
            });
        }
    }

    constructor.$inject = ["loginService"];
})(window);