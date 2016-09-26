define(['backbone', 'underscore', 'jquery', 'collections/playerPool',
    'collections/squadCollection', 'views/createTeamView', 'views/squadsView', 'data/formations'],
    function (Backbone, _, $, PlayerPool, SquadCollection, CreateTeamView, SquadView, formationsData) {
        var App = Backbone.Router.extend({
            routes: {
                '':             'index',
                'squad/(:id)':  'squad'
            },

            index: function() {
                var Bus = {};
                _.extend(Bus, Backbone.Events);

                //load players data
                var playerPool = new PlayerPool();

                //render main view
                var createTeamView = new CreateTeamView({
                    el: '#create-team',
                    formations: formationsData,
                    players: playerPool.toJSON()
                });

                var createdSquads = new SquadCollection(window._monEquipeBootstrap.squads);
                var squadView = new SquadView({
                    collection: createdSquads,
                    el: '#view-teams'
                });
            },

            squad: function(id) {
                console.log('Get All Squad', id);
            }
        });
        return App;
    });
