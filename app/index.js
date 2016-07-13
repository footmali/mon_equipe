define('jquery', [], function(){
    return jQuery;
});

requirejs.config({
    baseURl: '/',
    paths: {
        app: '/app',
        data: '/app/data',
        backbone: '../node_modules/backbone/backbone-min',
        underscore: '../node_modules/underscore/underscore-min',
        text: '../node_modules/text/text'
    },
    shim: {
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        }
    }
});

requirejs(['app/app']);
