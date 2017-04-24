module.exports = function () {
    let apps = [];
    let context = {
        app: null,
        createRoot: function (name) {
            let root = document.querySelector("main[wd-root=" + name + "]");
            if (root === null)
                console.error("root not found: " + name);
            else if (apps.some(x => x.name === name))
                console.error("root already created: " + name);
            else {
                var app = {};
                app.name = name;
                app.root = root;
                app.routes = [];
                this.app = app;
                apps.push(app);
            }
            return this;
        },
        root: function (name) {
            this.app = apps.find(x => x.name === name);
            if (this.app === undefined)
                console.error("app " + name + " not found");
            return this;
        },
        routes: function (routes) {
            this.app.routes = routes;
            return this;
        },
        navigate: function (url) {
            let app = this.app;
            let templateUrl = app.routes.find(x => x.url === url).templateUrl;
            if (templateUrl === undefined)
                console.error(url + " is not defined");
            else {
                fetch(templateUrl, { method: 'get' })
                    .then(response => response.text())
                    .then(result => app.root.innerHTML = result)
                    .catch(error => console.error(error));
            }
            return this;
        }
    };
    return context;
}();