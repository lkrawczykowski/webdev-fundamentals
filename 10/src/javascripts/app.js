let wd = require('./wd.js');

window.onload = function () {
    wd.createRoot('app')
        .routes([
            { url: '/', templateUrl: 'routes/home.html' },
            { url: '/sign-in', templateUrl: 'routes/sign-in.html' }
        ]);

    wd.root('app')
        .navigate('/')
        .navigate('/sign-in');
}