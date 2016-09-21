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

        //listener for share button
        $('body').on('click', '#confirm-share', function() {
            var team = $(this).attr('data-team');
            FB.ui({
                method: 'feed',

                //The link attached to this post
                link: 'http://' + window.location.host + '/#/team/' + team._id,

                //The URL of a picture attached to this post
                picture: 'http://' + window.location.host + '/public/teams/' + team.image_facebook,

                 //The name of the link attachment
                name: 'name text',

                 //The caption of the link (appears beneath the link name)
                caption: 'caption text',

                //The description of the link (appears beneath the link caption)
                description: 'description text',

                //Comma-separated list used in Facebook Insights to help you measure the performance
                ref: 'monequipe'
            }, function(response){
                if (response && !response.error_message) {
                    console.log('Posting completed.');
                } else {
                    console.log('Error while posting.');
                }
            });
        });
    });
