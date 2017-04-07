module.exports = function () {
    let apps = [];

    function renderComponents(app) {
        app.components.forEach(component => {
            let tags = document.getElementsByTagName(component.name);
            for (var i = 0; i < tags.length;) {
                let componentData = { name: component.name, template: component.descriptor.template };
                component.descriptor.beforeMount(app, tags[i], componentData);
            }
        });
    }

    let app = {
        appRootName: null,
        appRoot: null,
        appRoutes: [],
        components: [],
        createRoot: function (rootName) {
            let app = this;
            window.onpopstate = function (e) {
                if (e.state !== null) {
                    var url = e.state.url;
                    app.navigate(url, false);
                }
            };

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
        navigate: function (url, affectsHistory = true) {
            let app = this;
            let templateUrl = this.appRoutes.find(x => x.url === url).templateUrl;
            if (templateUrl === undefined)
                console.error(url + " is not defined");
            else {
                fetch(templateUrl, {
                    method: 'get'
                }).then(function (response) {
                    return response.text();
                }).then(function (result) {
                    app.appRoot.innerHTML = result;
                    renderComponents(app);
                    if (affectsHistory)
                        history.pushState({ url: url }, 'route: ' + url, url);
                }).catch(function (error) {
                    console.error(error);
                });
            }
            return this;
        },
        component: function (name, descriptor) {
            this.components.push({ name: name, descriptor: descriptor });
            return this;
        }
    };
    return app;
}();