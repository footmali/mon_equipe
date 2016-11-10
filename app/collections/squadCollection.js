define(['backbone', 'underscore', 'pageableCollection'], function(Backbone, _, PageableCollection) {
    var Squad = Backbone.PageableCollection.extend({
        url: '/teams.php',
        mode: 'infinite',

        // Initial pagination states
        state: {
            pageSize: 9
        },
    });

    return Squad;
})
