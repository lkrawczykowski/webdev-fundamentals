module.exports = function () {
    let apps = [];

    let app = {
        appRootName: null,
        appRoot: null,
        appRoutes: [],
        createRoot: function (rootName) {
            let root = document.querySelector("main[wd-root=" + rootName + "]");
            if (root === null)
                console.error("root not found: " + rootName);
            else if (apps.some(x => x.appRootName === rootName))
                console.error("root already created: " + rootName);
            else {
                this.appRootName = rootName;
                this.appRoot = root;
                apps.push(this);
            }
            return this;
        },
        root: function (rootName) {
            return apps.find(x => x.appRootName === rootName);
        },
        routes: function (routes) {
            this.appRoutes = routes;
            return this;
        },
        navigate: function (url) {
            let route = this.appRoutes.find(x => x.url === url);
            if (route === undefined) {
                console.error(route + " is not defined");
            } else {
                let appRoot = this.appRoot;
                var templateUrl = route.templateUrl;
                fetch(templateUrl, {
                    method: 'get'
                }).then(function (response) {
                    return response.text();
                }).then(function (result) {
                    appRoot.innerHTML = result;
                }).catch(function (error) {
                    console.error(error);
                });
            }
            return this;
        }
    };
    return app;
}();