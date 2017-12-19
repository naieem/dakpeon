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
                    if (response && response.success) {
                        /*------------------ loading externalScripts -------------*/
                        loadExternalScripts(externalScripts).then(function(response) {
                            if (response && response.success) {
                                // =================================
                                // if external files are loaded
                                // this is to call main modules
                                // dependend files
                                // =================================
                                loadingModulesAndDependencies().then(function(response) {
                                    if (response && response.success) {
                                        // =================================
                                        // if modules main files are loaded
                                        // this is called to load their
                                        // dependend files
                                        // =================================
                                        loadDependencyFiles().then(function(response) {
                                            if (response && response.success) {
                                                // =================================
                                                // configuring navigations
                                                // =================================
                                                getNavigation(appConfiguration.navigations);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }

        request.open('Get', 'app.json');
        request.send();
    }

    /*=====  End of configuration  ======*/

    // ===================================================
    // loading data bearer modules
    // ===================================================
    function loadDataBearerModules() {
        return new Promise(function(resolve, reject) {
            var directoryUrl = appConfiguration.dataBearerModules.directoryName + "/" + appConfiguration.dataBearerModules.name;
            w.load(directoryUrl + "/" + appConfiguration.dataBearerModules.name + ".config.js").then(function(response) {
                if (response && response.success) {
                    w.modules.push(appConfiguration.dataBearerModules.name);
                    /*----------------------- loading dependencies --------------------------------------*/
                    for (var index = 0; index < appConfiguration.dataBearerModules.dependency.length; index++) {
                        w.load(directoryUrl + "/" + appConfiguration.dataBearerModules.dependency[index] + ".js").then(function(res) {
                            if (res && res.success) {
                                if (index == appConfiguration.dataBearerModules.dependency.length) {
                                    resolve({
                                        success: true
                                    });
                                }
                            }
                        });
                    }
                }
            });
        });
    }

    // =============================================
    // loading external scripts in the application
    // =============================================
    function loadExternalScripts(externalScripts) {
        return new Promise(function(resolve, reject) {
            if (externalScripts && externalScripts.length) {
                for (var i = 0; i < externalScripts.length; i++) {
                    if (externalScripts[i].type == 'css') {
                        w.loadStyle(externalScripts[i].url, externalScripts[i].name).then(function(response) {
                            if (response && response.success) {
                                // =================================
                                // if external files are loaded
                                // this is called to load their
                                // dependend files
                                // =================================
                                if (i == externalScripts.length) {
                                    resolve({
                                        success: true
                                    });

                                }
                            }
                        });
                    }

                    if (externalScripts[i].type == 'js') {
                        w.load(externalScripts[i].url).then(function(response) {
                            if (response && response.success) {
                                // =================================
                                // if external files are loaded
                                // this is called to load their
                                // dependend files
                                // =================================
                                if (i == externalScripts.length) {
                                    resolve({
                                        success: true
                                    });
                                }
                            }
                        });
                    }
                }
            } else {
                resolve({
                    success: true
                });
            }
        });

    }

    function loadingModulesAndDependencies() {
        return new Promise(function(resolve, reject) {
            for (var i = 0; i < appConfiguration.modules.length; i++) {
                // ===============================
                // saving modules for using
                // in the bootstrap file
                // as dependency
                // ===============================          
                w.modules.push(appConfiguration.modules[i].name);
                loadSingleScript(appConfiguration.modules[i].name).then(function(response) {
                    if (response && response.success) {
                        if (i == appConfiguration.modules.length) {
                            resolve({
                                success: true
                            });
                        }
                    }
                });
            }
        });

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
        return new Promise(function(resolve, reject) {
            var modules = appConfiguration.modules;
            for (var i = 0; i < modules.length; i++) {
                loadScript(modules[i].name, modules[i].dependency).then(function(response) {
                    if (response && response.success) {
                        if (i == modules.length) {
                            resolve({
                                success: true
                            });
                        }
                    }
                });
            }
        });
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
                w.executeAction('bootstrap');
            }
        }
    }


    /*----------  loading single script files  ----------*/


    function loadSingleScript(fileAndFolderName) {
        return new Promise(function(resolve, reject) {
            w.load("modules/" + fileAndFolderName + "/" + fileAndFolderName + '.config.js').then(function(response) {
                if (response && response.success) {
                    resolve(response);
                }
            });
        });
    }

    /*----------  loading style script files  ----------*/

    function loadStyleScript(filesUrl, fileId) {
        w.loadStyle(filesUrl, fileId);
    }


    /*----------  loading array of script files from given directory  ----------*/


    function loadScript(directoryName, filesArr) {
        return new Promise(function(resolve, reject) {
            for (var i = 0; i < filesArr.length; i++) {
                w.load("modules/" + directoryName + "/" + filesArr[i] + '.js').then(function(response) {
                    if (response && response.success) {
                        if (i == filesArr.length) {
                            resolve({
                                success: true
                            });
                        }
                    }
                });
            }
        });
    }

})(window);