angular
  .module('login', []);
angular
  .module('login')
  .controller('loginController', constructor);

/* @ngInject */
function constructor(loginService) {
  var vm = this;
  debugger;
}

constructor.$inject = ['loginService'];
