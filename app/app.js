define(['backbone', 'underscore', 'jquery', 'collections/playerPool',
    'views/createTeamView', 'data/formations'],
    function (Backbone, _, $, PlayerPool, CreateTeamView, formationsData) {
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

    });
