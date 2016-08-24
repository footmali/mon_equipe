define(['backbone', 'underscore', 'jquery', 'aws', 'collections/playerPool',
    'views/createTeamView', 'data/formations'],
    function (Backbone, _, $, AWS, PlayerPool, CreateTeamView, formationsData) {
        var Bus = {};
        _.extend(Bus, Backbone.Events);

        //load players data
        var playerPool = new PlayerPool();

        var bucket = new AWS.S3({
            params: {
                Bucket: 'mon-equipe'
            },
            accessKeyId: 'AKIAILUWK4N272D42KZA',
            secretAccessKey: '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',
            region: 'Frankfurt'
        });

        //render main view
        var createTeamView = new CreateTeamView({
            el: '#create-team',
            formations: formationsData,
            players: playerPool.toJSON(),
            bucket: bucket
        });
    });
