define(['backbone', 'jquery', 'text!templates/squad.html'], function(Backbone, $, viewTemplate) {
    var SquadView = Backbone.View.extend({
        template: _.template(viewTemplate),

        initialize: function(options) {
            this.render();
        },

        events: {
            'click #confirm-share': 'share'
        },

        render: function() {
            this.$el.html(this.template({ squad: this.model.toJSON() }));
        },

        share: function() {
            var team = this.model.toJSON();

            if(window.gAnalytic){
                window.gAnalytic('send', {
                  hitType: 'event',
                  eventCategory: 'Mon Equipe',
                  eventAction: 'click',
                  eventLabel: 'Share Button'
                });
            }

            FB.ui({
                method: 'feed',

                //The link attached to this post
                link: 'http://' + window.location.host + '/squad/' + team.id,

                //The URL of a picture attached to this post
                picture: 'http://' + window.location.host + '/public/teams/' + team.image_facebook,

                 //The name of the link attachment
                name: team.name.replace(/\b\w/g, function(l){ return l.toUpperCase() }),

                //The description of the link (appears beneath the link caption)
                description: 'Footmali.com | Mon Équipe. Créez votre équipe de rêve. Partagez avec des amis',

                 //The caption of the link (appears beneath the link name)
                caption: 'via Footmali.com',

                //Comma-separated list used in Facebook Insights to help you measure the performance
                ref: 'monequipe'
            }, function(response){
                if (response && !response.error_message && window.gAnalytic) {
                    window.gAnalytic('send', {
                      hitType: 'event',
                      eventCategory: 'Mon Equipe',
                      eventAction: 'share',
                      eventLabel: 'Facebook Share'
                    });
                }
            });
        }
    });

    return SquadView;
});
