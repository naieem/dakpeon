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
                //alert(w.appName);
                loadDataBearerModules();
                // loadDataBearerModules().then(function(response) {
                //     alert(response);
                //     // if (response == 'complete') {
                //     //     if (externalScripts && externalScripts.length)
                //     //         loadExternalScripts(externalScripts);
                //     //     else
                //     //         loadingModulesAndDependencies();
                //     // }
                // });

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
                    document.getElementById("load_module").innerHTML = "loaded";
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
        var directoryUrl = appConfiguration.dataBearerModules.directoryName + "/" + appConfiguration.dataBearerModules.name;
        w.load(directoryUrl + "/" + appConfiguration.dataBearerModules.name + ".config.js", loadDataBearerDependency, '0');
        w.modules.push(appConfiguration.dataBearerModules.name);
        //return "from function";
    }

    function loadDataBearerDependency(index) {
        debugger;
        setTimeout(function() {
            var directoryUrl = appConfiguration.dataBearerModules.directoryName + "/" + appConfiguration.dataBearerModules.name;
            if (index < appConfiguration.dataBearerModules.dependency.length) {
                var url = directoryUrl + "/" + appConfiguration.dataBearerModules.dependency[index] + ".js";
                index++;
                w.load(url, loadDataBearerDependency, index);
            } else {
                //alert("load done");
                if (appConfiguration.externalScript && appConfiguration.externalScript.length)
                    loadExternalScripts(appConfiguration.externalScript);
                else
                    loadingModulesAndDependencies(0);
            }
        }, 100);

        // for (var index = 0; index < appConfiguration.dataBearerModules.dependency.length; index++) {
        //     var url = directoryUrl + "/" + appConfiguration.dataBearerModules.dependency[index] + ".js";
        //     w.load(directoryUrl + "/" + appConfiguration.dataBearerModules.name + ".config.js", loadDataBearerDependency);

        // }
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

    function loadingModulesAndDependencies(index) {
        debugger;
        //for (var i = 0; i < appConfiguration.modules.length; i++) {
        // loadSingleScript(appConfiguration.modules[i].name);
        if (index < appConfiguration.modules.length) {
            var url = "modules/" + appConfiguration.modules[index].name + "/" + appConfiguration.modules[index].name + '.config.js';

            // ===============================
            // saving modules for using
            // in the bootstrap file
            // as dependency
            // ===============================          
            w.modules.push(appConfiguration.modules[index].name);
            index++;
            w.load(url, loadingModulesAndDependencies, index);
        } else {
            //alert('module load done');
            // =================================
            // if modules main files are loaded
            // this is called to load their
            // dependend files
            // =================================
            setTimeout(function() {
                loadDependencyFiles('0');
            }, 100);
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
    function loadDependencyFiles(index) {

        var modules = appConfiguration.modules;
        // for (var i = 0; i < modules.length; i++) {
        if (index < modules.length)
            loadScript(index, '0');
        else
            getNavigation(appConfiguration.navigations);
        // if ((i + 1) == modules.length) {
        //     getNavigation(appConfiguration.navigations); // getting navigations configurations
        // }
        // }
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
                    alert('all loaded');
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


    function loadScript(directoryIndex, fileIndex) {
        debugger;
        var directoryName = appConfiguration.modules[directoryIndex].name;
        if (fileIndex < appConfiguration.modules[directoryIndex].dependency.length) {
            var url = "modules/" + directoryName + "/" + appConfiguration.modules[directoryIndex].dependency[fileIndex] + '.js';
            fileIndex++;
            w.load(url, loadScript, directoryIndex, fileIndex);
        } else {
            directoryIndex++
            loadDependencyFiles(directoryIndex);
        }

        // for (var i = 0; i < filesArr.length; i++) {
        //     w.load(url, loadingModulesAndDependencies, index);
        //     w.load("modules/" + directoryName + "/" + filesArr[i] + '.js');
        // }
    }

})(window);