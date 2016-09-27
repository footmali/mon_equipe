define(['backbone', 'underscore'], function(Backbone, _) {
    var SquadModel = Backbone.Model.extend({
        urlRoot: '/teams.php',

        parse: function(response) {
            return _.first(response);
        }
    });

    return SquadModel;
});
