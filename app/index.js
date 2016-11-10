define('jquery', [], function(){
    return jQuery;
});

requirejs.config({
    baseURl: '/',
    paths: {
        app: '/app',
        data: '/app/data',
        backbone: '../node_modules/backbone/backbone-min',
        pageableCollection: '../node_modules/backbone.paginator/lib/backbone.paginator.min',
        underscore: '../node_modules/underscore/underscore-min',
        text: '../node_modules/text/text',
        domtoimage: '../node_modules/dom-to-image/dist/dom-to-image.min',
    },
    shim: {
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        domtoimage: {
            exports: 'domtoimage'
        }
    }
});

define(['app/app', 'backbone'], function(App, Backbone) {
    var app = new App();
    Backbone.history.start({hashChange: false});
});
