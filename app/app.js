define(['backbone', 'underscore', 'jquery', 'collections/playerPool',
    'collections/squadCollection', 'models/squad', 'views/createTeamView', 'views/squadsView', 'views/squadView', 'data/formations'],
    function (Backbone, _, $, PlayerPool, SquadCollection, Squad, CreateTeamView, SquadsView, SquadView, formationsData) {
        var App = Backbone.Router.extend({
            initialize: function() {
                window.gAnalytic = window.ga || {};
            },

            routes: {
                '':             'index',
                'squad/(:id)':  'squad'
            },

            index: function() {
                gAnalytic('send', 'pageview', {title: 'Creez Votre Équipe'});

                $('#tabs-container').show();

                //load players data
                var playerPool = new PlayerPool();

                //render create team view
                var createTeamView = new CreateTeamView({
                    el: '#create-team',
                    formations: formationsData,
                    players: playerPool.toJSON()
                });

                //render squads view
                var createdSquads = new SquadCollection(window._monEquipeBootstrap.squads);
                var squadsView = new SquadsView({
                    collection: createdSquads,
                    el: '#view-teams'
                });
                this.listenTo(squadsView, 'squadsView:showSquad', function(id) {
                    this.navigate('squad/'+id, {trigger: true});
                }, this);
            },

            squad: function(id) {
                gAnalytic('send', 'pageview', {title: 'Équipe: ' + id});

                $('#tabs-container').hide();
                var squad = new Squad();

                squad.fetch({
                    data: $.param({team: id}),
                    success: function(response) {
                        new SquadView({
                            el: '#app-container',
                            model: squad
                        });
                    }
                });

            }
        });
        return App;
    });
