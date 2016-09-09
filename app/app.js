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
            var shareUrl = $(this).attr('data-url');
            FB.ui({
                method: 'share',
                display: 'popup',
                href: shareUrl,
                quote: 'Voir mon equipe',
                hashtag: '#footmaliMonEquipe'
            }, function(response){
                if (response && !response.error_message) {
                    console.log('Posting completed.');
                } else {
                    console.log('Error while posting.');
                }
            });
        });
    });
