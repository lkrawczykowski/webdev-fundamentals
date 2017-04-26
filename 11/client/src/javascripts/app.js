let wd = require('./wd.js');

window.onload = function () {
    wd.createRoot('app')
        .routes([
            { url: '/', templateUrl: 'routes/home.html' },
            { url: '/sign-in', templateUrl: 'routes/sign-in.html' }
        ])
        .component("RouterLink", {
            template: "<a href=\"\"><\/a>",
            beforeMount: function (app, element, componentData) {
                let replacement = document.createElement("a");
                replacement.setAttribute("href", element.getAttribute("href"));
                replacement.innerHTML = element.innerHTML;
                replacement.addEventListener("click", function (e) {
                    e.preventDefault();
                    var url = e.srcElement.getAttribute('href');
                    app.navigate(url);
                });
                element.parentNode.replaceChild(replacement, element);
            }
        })
        .component("Search", {
            template: "<input class=\"awesomplete\"data-list=\"\" />",
            beforeMount: function (app, element, componentData) {
                let replacement = document.createElement("input");
                replacement.setAttribute("placeholder", element.getAttribute("placeholder"));
                replacement.setAttribute("type", "text");
                replacement.id = "products-search";
                replacement.class = "awesomeplete";
                element.parentNode.replaceChild(replacement, element);
                var autocomplete = new Awesomplete(replacement);
                replacement.onkeyup = function (e) {
                    var query = e.srcElement.value;
                    if (query.length > 2) {
                        var address = "http://localhost:8082/api/search?query=" + query;
                        fetch(address, { method: 'get' })
                        .then(response => response.text())
                        .then(result => autocomplete.list = JSON.parse(result).suggestions)
                        .catch(error => console.error(error));
                    }
                }
            }
        })
        .navigate("/");
}