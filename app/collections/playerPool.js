define(['backbone', 'underscore', 'data/playersList', 'models/player'],
    function (Backbone, _, playersList, Player) {
        var PlayerPool = Backbone.Collection.extend({
            model: Player,

            initialize: function() {
                var self = this;
                _.each(playersList, function(position) {
                    _.each(position, function(playerData) {
                        self.add(new Player(playerData));
                    });
                });
            }
        });

        return PlayerPool;
    });
