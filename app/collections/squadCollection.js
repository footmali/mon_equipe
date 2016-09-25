define(['backbone', 'underscore'], function(Backbone, _) {
    var Squad = Backbone.Collection.extend({
        url: '/teams.php',
    });

    return Squad;
})
