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


    function loadStyle(url, fileId) {
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

    function load(url, callbackfn, index) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = url;
        if (callbackfn && index) {
            s.onload = callbackfn(index);
        } else if (callbackfn && !index) {
            s.onload = callbackfn();
        }
        var x = document.getElementsByTagName('head')[0];
        x.appendChild(s);
        // return new Promise(function(resolve, reject) {
        // var s = document.createElement('script');
        // s.type = 'text/javascript';
        // s.async = true;
        // s.src = url;
        // s.onload = function() {
        //     alert('success');
        // }
        // var x = document.getElementsByTagName('head')[0];

        // var request = new XMLHttpRequest();

        // request.onreadystatechange = function() {
        //     if (request.readyState === 4) {
        //       //s.innerHTML=request.response;
        //       //x.appendChild(s);
        //       document.getElementById("load_module").innerHTML="loaded";
        //       resolve('success');
        //       debugger;
        //     }
        // }

        //     request.open('Get', url);
        //     request.send();
        // });
    }

    function registerAction(id, callbackFn) {
        w.observable[id] = callbackFn;
    }

    function executeAction(id) {
        w.observable[id]();
    }
})(window);