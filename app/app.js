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
                gAnalytic('send', 'pageview', {title: 'Mon Équipe | Footmali.com | Creez Votre Équipe'});

                var dest = this.getQueryVariable('dest');

                if(dest){
                    $('#header-tabs a#'+dest+'-tab').tab('show');
                }

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
                var self = this;
                gAnalytic('send', 'pageview', {title: 'Mon Équipe | Footmali.com | Équipe: ' + id});

                $('#tabs-container').hide();
                var squad = new Squad();

                squad.fetch({
                    data: $.param({team: id}),
                    success: function(response) {
                       squadView =  new SquadView({
                            el: '#app-container',
                            model: squad
                        });

                        squadView.on('seeAllSquad', function() {
                            console.log('app');
                            this.navigate('/?dest=view-teams', {trigger: true});
                        }, self);
                    }
                });

            },

            getQueryVariable: function(variable){
               var query = window.location.search.substring(1);
               var vars = query.split("&");
               for (var i=0;i<vars.length;i++) {
                       var pair = vars[i].split("=");
                       if(pair[0] == variable){return pair[1];}
               }
               return(false);
            }
        });
        return App;
    });
