angular
    .module('login')
    .service('loginService', constructor);

/* @ngInject */
function constructor($q,$http) {
    var vm = this;
    
}

constructor.$inject = ['$q','$http'];