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
                //console.log("beforeMount", app, element, componentData);
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
        .navigate("/");
}