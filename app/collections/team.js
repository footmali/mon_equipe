define(['backbone', 'underscore'], function(Backbone, _) {
    var Team = Backbone.Collection.extend({
        modelId: function(attrs) {
            return attrs.position;
        }
    });

    return Team;
})
