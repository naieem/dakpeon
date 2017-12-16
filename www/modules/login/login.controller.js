angular
  .module('login')
  .controller('loginController', constructor);

/* @ngInject */
function constructor(loginService) {
  var vm = this;
  
}

constructor.$inject = ['loginService'];