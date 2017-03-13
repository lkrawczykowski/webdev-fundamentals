const routes = [
    { url: '/', template: '<h1>home page</h1>' },
    { url: '/sign-in', template: '<h1>sign in page</h1>' },
    { url: '/sign-up', template: '<h1>sign up page</h1>' }
];

window.onload = function () {
    var defaul_route = routes[0];
    apply_template(defaul_route.template);
    history.pushState({ url: defaul_route.url }, 'route: ' + defaul_route.url, defaul_route.url);
    each(document.querySelectorAll("#menu > li > a"), override_click);
}

function override_click(menu_item) {
    menu_item.addEventListener("click", on_menu_item_click);
}

window.onpopstate = function (e) {
    if (e.state !== null) {
        var url = e.state.url;
        change_route(url);
        //history.replaceState({ url: url }, 'route: ' + url, url);
    }
}

function on_menu_item_click(e) {
    e.preventDefault();
    var url = e.srcElement.getAttribute('href');
    if (url !== history.state.url) {
        change_route(url);
        history.pushState({ url: url }, 'route: ' + url, url);
    }
}

function change_route(url) {
    var route = routes.find(route_with_url(url));
    apply_template(route.template);
}

function apply_template(template) {
    document.querySelector("#app").innerHTML = template;
}

function route_with_url(url) {
    return function (route) {
        return route.url === url;
    }
}

function map(a1, f1) {
    var a2 = [];
    for (var i = 0; i < a1.length; i++)
        a2[i] = f1(a1[i])
    return a2;
}

function each(a1, f1) {
    for (var i = 0; i < a1.length; i++)
        f1(a1[i])
}