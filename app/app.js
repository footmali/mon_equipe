define(['backbone', 'underscore', 'jquery', 'collections/playerPool',
    'views/createTeamView', 'data/formations'],
    function (Backbone, _, $, PlayerPool, CreateTeamView, formationsData) {

        // Global event dispatcher
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

        //collection to hold selected players
        //var team = new Team();

        // Event Listners
            //appView.on('formationChanged');

        console.log('Team Builder App', playerPool.at(0).get('name'));
    });
