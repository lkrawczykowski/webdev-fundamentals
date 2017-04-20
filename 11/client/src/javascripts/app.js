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
                replacement.href = element.getAttribute("href");
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
                replacement.placeholder = element.getAttribute("placeholder");
                replacement.type = "text";
                replacement.id = "products-search";
                replacement.class = "awesomeplete";
                element.parentNode.replaceChild(replacement, element);
                var autocomplete = new Awesomplete(replacement);
                replacement.onkeyup = function (e) {
                    var query = e.srcElement.value;
                    if (query.length > 2) {
                        var address = "http://localhost:8082/api/search?query=" + query;
                        console.log(address);
                        fetch(address, {
                            method: 'get'
                        }).then(function (response) {
                            return response.text();
                        }).then(function (result) {
                            autocomplete.list = JSON.parse(result).suggestions;
                        }).catch(function (error) {
                            console.error(error);
                        });
                    }
                }
            }
        })
        .navigate("/");
}