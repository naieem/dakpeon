(function(w) {
  'use strict';
  w.load=load;
  function load(url) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = url;
    var x = document.getElementsByTagName('head')[0];
    x.appendChild(s);
  }
  w.observable=[];
  w.registerAction=function(id,callbackFn){
  	w.observable[id]=callbackFn;
  }
  w.executeAction=function(id){
  	w.observable[id]();
  }
})(window);
