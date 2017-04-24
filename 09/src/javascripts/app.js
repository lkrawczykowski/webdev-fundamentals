let wd = require('./wd.js');

window.onload = function () {
    let a = wd.createRoot('app')
        .routes([
            { url: '/', templateUrl: 'routes/home.html' },
            { url: '/sign-in', templateUrl: 'routes/sign-in.html' }
        ]);

    wd.root('app').navigate('/');

    setTimeout(() => {
        wd.root('app').navigate('/sign-in');
    }, 3000)

    let b = wd.createRoot('appB');

    const test = { a: 0 };
    console.log(test.a);
    test.a = 1;
    console.log(test.a);
}