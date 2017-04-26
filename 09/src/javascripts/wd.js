module.exports = function () {
    let apps = [];

    function App() {
        this.appName = null;
        this.appRoot = null;
        this.appRoutes = [];
        this.root = (name) => {
            let app = apps.find(x => x.appName === name);
            if (app === undefined)
                console.error("app " + name + " not found");
            return app;
        };
        this.routes = (routes) => {
            this.appRoutes = routes;
            return this;
<<<<<<< HEAD
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
=======
        };
        this.navigate = (url) => {
            let templateUrl = this.appRoutes.find(x => x.url === url).templateUrl;
            if (templateUrl === undefined)
                console.error(url + " is not defined");
            else {
                fetch(templateUrl, { method: 'get' })
                    .then(response => response.text())
                    .then(result => this.appRoot.innerHTML = result)
                    .catch(error => console.error(error));
>>>>>>> master
            }
            return this;
        }
    };

    App.prototype.createRoot = function (name) {
        let root = document.querySelector("main[wd-root=" + name + "]");
        if (root === null)
            console.error("root not found: " + name);
        else if (apps.some(x => x.appName === name))
            console.error("root already created: " + name);
        else {
            let app = new App();
            app.appName = name;
            app.appRoot = root;
            app.appRoutes = [];
            apps.push(app);
            return app;
        }
    };
    return new App();
}();