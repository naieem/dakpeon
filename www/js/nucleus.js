(function(w) {
    'use strict';

    // ==============================================
    // main variables to share between windows
    // ==============================================

    var appConfiguration = {};
    w.modules = ['ionic']; // by default add ionic as dependency submodule 
    w.navigationMenu = []; // arrays of all navigation configuration
    w.appName = ''; // main appname and main module name to be used in the bootstrap
    w.defaultUrl = ""; // main redirect url for ui-router default url link
    getConfiguration(); // getting modules configurations


    // =================================================
    // getting modules main configuration from app.json
    // =================================================

    function getConfiguration() {
        var request = new XMLHttpRequest();

        request.onreadystatechange = function() {
            if (request.readyState === 4) {

                /*----------  getting app configuration   ----------*/
                appConfiguration = JSON.parse(request.response);
                /*----------  assigning appname or main module  ----------*/
                w.appName = appConfiguration.appName;
                /*----------  main redirect url for ui-router default url link ----------*/
                w.defaultUrl = generateUrl(appConfiguration.defaulApp);
                /*----------  all the modules to load  ----------*/
                var modules = appConfiguration.modules;
                /*----------  all the external scripts to load  ----------*/
                var externalScripts = appConfiguration.externalScript;
                /*------------------ loading data bearer modules ---------*/
                loadDataBearerModules().then(function(response) {
                    debugger;
                    // if (response == 'complete') {
                    //     if (externalScripts && externalScripts.length)
                    //         loadExternalScripts(externalScripts);
                    //     else
                    //         loadingModulesAndDependencies();
                    // }
                });
                alert("dsf");
                /*------------------ loading externalScripts -------------*/

                // setTimeout(function() {
                //     if (externalScripts && externalScripts.length)
                //         loadExternalScripts(externalScripts);
                //     else
                //         loadingModulesAndDependencies();
                // }, 1500);

            }
        }

        request.open('Get', 'app.json');
        request.send();
    }

    /*=====  End of configuration  ======*/

    function load() {
        return new Promise(function(resolve, reject) {
            var s = document.createElement('script');
            // s.type = 'text/javascript';
            // s.async = true;
            // s.src = url;
            // s.onload = function() {
            //     resolve('success');
            // }
            //var x = document.getElementsByTagName('head')[0];
            
            var request = new XMLHttpRequest();

            request.onreadystatechange = function() {
                if (request.readyState === 4) {
                  //s.innerHTML=request.response;
                  //x.appendChild(s);
                  document.getElementById("load_module").innerHTML="loaded";
                  resolve('success');
                  debugger;
                }
            }

            request.open('Get', '../app.json');
            request.send();
        }); 
    }
    // ===================================================
    // loading data bearer modules
    // ===================================================
    function loadDataBearerModules() {
        // var directoryUrl = appConfiguration.dataBearerModules.directoryName + "/" + appConfiguration.dataBearerModules.name;
        // w.load(directoryUrl + "/" + appConfiguration.dataBearerModules.name + ".config.js");
        // w.modules.push(appConfiguration.dataBearerModules.name);
        /*----------------------- loading dependencies --------------------------------------*/

        return new Promise(function(resolve, reject) {
            for (var index = 0; index < appConfiguration.dataBearerModules.dependency.length; index++) {
                //var url = directoryUrl + "/" + appConfiguration.dataBearerModules.dependency[index] + ".js";
                load().then(function(response) {
                    debugger;
                    if (response == 'success') {
                        debugger;
                        if ((index) == appConfiguration.dataBearerModules.dependency.length) {
                            alert('sdfd');
                            resolve("complete");
                        }
                    }
                });

            }
        });
    }

    // =============================================
    // loading external scripts in the application
    // =============================================
    function loadExternalScripts(externalScripts) {
        if (externalScripts && externalScripts.length) {
            for (var i = 0; i < externalScripts.length; i++) {
                if (externalScripts[i].type == 'css')
                    w.loadStyle(externalScripts[i].url, externalScripts[i].name);
                if (externalScripts[i].type == 'js')
                    w.load(externalScripts[i].url);

                // =================================
                // if external files are loaded
                // this is called to load their
                // dependend files
                // =================================
                if ((i + 1) == externalScripts.length) {
                    setTimeout(function() {
                        loadingModulesAndDependencies();
                    }, 100);
                }
            }
        } else {
            loadingModulesAndDependencies();
        }

    }

    function loadingModulesAndDependencies() {
        for (var i = 0; i < appConfiguration.modules.length; i++) {
            loadSingleScript(appConfiguration.modules[i].name);
            // ===============================
            // saving modules for using
            // in the bootstrap file
            // as dependency
            // ===============================          
            w.modules.push(appConfiguration.modules[i].name);
            // =================================
            // if modules main files are loaded
            // this is called to load their
            // dependend files
            // =================================
            if ((i + 1) == appConfiguration.modules.length) {
                setTimeout(function() {
                    loadDependencyFiles();
                }, 100);
            }
        }
    }

    // =========================================================
    // generating  url from defaultApps object
    // =========================================================
    function generateUrl(navigationObject) {
        var url = "";
        for (var i = 0; i < appConfiguration.navigations.length; i++) {
            if (appConfiguration.navigations[i].navigationName == navigationObject.name) {
                url += appConfiguration.navigations[i].url;
                if (navigationObject.children) {
                    for (var j = 0; j < appConfiguration.navigations[i].Children.length; j++) {
                        if (appConfiguration.navigations[i].Children[j].navigationName == navigationObject.children) {
                            url += appConfiguration.navigations[i].Children[j].url;
                        }
                    }
                }
            }
        }

        return url;
    }

    // =============================================
    // function to load dependent files of
    // main config modules
    // =============================================
    function loadDependencyFiles() {

        var modules = appConfiguration.modules;
        for (var i = 0; i < modules.length; i++) {
            loadScript(modules[i].name, modules[i].dependency);
            if ((i + 1) == modules.length) {
                getNavigation(appConfiguration.navigations); // getting navigations configurations
            }
        }
    }

    // ================================================
    // storing navigation values for using in routing
    // and bootstrapping call to start execution
    // of the main module
    // ================================================
    function getNavigation(navigations) {

        for (var i = 0; i < navigations.length; i++) {
            w.navigationMenu.push(navigations[i]);
            // ===========================================
            // when all the module and navigations are
            // loaded then bootstrap the main application
            // ===========================================
            if ((i + 1) == navigations.length) {
                setTimeout(function() {
                    w.executeAction('bootstrap');
                }, 1000);
            }
        }
    }


    /*----------  loading single script files  ----------*/


    function loadSingleScript(fileAndFolderName) {
        w.load("modules/" + fileAndFolderName + "/" + fileAndFolderName + '.config.js');
    }

    /*----------  loading style script files  ----------*/

    function loadStyleScript(filesUrl, fileId) {
        w.loadStyle(filesUrl, fileId);
    }


    /*----------  loading array of script files from given directory  ----------*/


    function loadScript(directoryName, filesArr) {

        for (var i = 0; i < filesArr.length; i++) {

            w.load("modules/" + directoryName + "/" + filesArr[i] + '.js');
        }
    }

})(window);