(function(w) {
  'use strict';

  // ===================================================
  // declaring variables for using in global use
  // ===================================================
  w.observable = [];
  w.registerAction = registerAction;
  w.executeAction = executeAction;
  w.load = load;
  w.loadStyle = loadStyle;

  //================== functions definitions are here =============


  function loadStyle(url,fileId) {
    if (!document.getElementById(fileId)) {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.id = fileId;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = url;
      link.media = 'all';
      head.appendChild(link);
    }
  }

  function load(url) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = url;
    var x = document.getElementsByTagName('head')[0];
    x.appendChild(s);
  }

  function registerAction(id, callbackFn) {
    w.observable[id] = callbackFn;
  }

  function executeAction(id) {
    w.observable[id]();
  }
})(window);
