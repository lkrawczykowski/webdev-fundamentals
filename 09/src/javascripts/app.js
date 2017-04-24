let wd = require('./wd.js');

window.onload = function () {
    const application = wd.createRoot('app')
        .routes([
            { url: '/', templateUrl: 'routes/home.html' },
            { url: '/sign-in', templateUrl: 'routes/sign-in.html' }
        ]);

    application.root('app').navigate('/');

    setTimeout(() => {
        wd.root('app').navigate('/sign-in');
    }, 3000);

    wd.createRoot('appB');
}