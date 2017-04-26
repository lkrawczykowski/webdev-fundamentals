let wd = require('./wd.js');

window.onload = function () {

    console.log(wd);

    var application = wd
        .createRoot('app');

    console.log(application);

    application.routes([
        { url: '/', templateUrl: 'routes/home.html' },
        { url: '/sign-in', templateUrl: 'routes/sign-in.html' }
    ]);

    //wd.root('app').navigate('/');

    setTimeout(() => {
        //wd.root('app').navigate('/sign-in');
    }, 3000);

    //wd.createRoot('appB');
}