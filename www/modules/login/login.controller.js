angular
    .module('login')
    .controller('loginController', constructor);

/* @ngInject */
function constructor(loginService) {
    var vm = this;
    vm.doLogin = doLogin;

    function doLogin(user) {
        loginService.login(user).then(function(response) {
            debugger;
        });
    }
}

constructor.$inject = ['loginService'];