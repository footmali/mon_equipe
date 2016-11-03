define(['backbone', 'underscore', 'jquery', 'text!templates/confirmationModal.html'],
    function(Backbone, _, $, confirmModalTemplate){
        var CreateTeamView = Backbone.View.extend({
            template: _.template(confirmModalTemplate),
            el: '.confirmation-modal-container',
            initialize: function(options) {
                this.team = options || {};
            },

            events: {
                'click #confirm-share': 'share'
            },

            render: function() {
                var self = this;
                this.$el.html(this.template({
                    team: self.team
                }));

                this.$el.find('#confirmation-modal').on('hidden.bs.modal', function (e) {
                    self.trigger('confirmation:close');
                });

                this.$el.find('#confirmation-modal').modal('show');
            },

            share: function() {
                var self = this;
                FB.ui({
                    method: 'feed',

                    //The link attached to this post
                    link: 'http://' + window.location.host + '/squad/' + self.team.id,

                    //The URL of a picture attached to this post
                    picture: 'http://' + window.location.host + '/public/teams/' + self.team.image_facebook,

                     //The name of the link attachment
                    name: self.team.name.replace(/\b\w/g, function(l){ return l.toUpperCase() }),

                    //The description of the link (appears beneath the link caption)
                    description: 'Footmali.com | Mon Équipe. Créez votre équipe de rêve. Partagez avec des amis.',

                     //The caption of the link (appears beneath the link name)
                    caption: 'via Footmali.com',

                    //Comma-separated list used in Facebook Insights to help you measure the performance
                    ref: 'monequipe'
                }, function(response){
                    if (response && !response.error_message) {
                        self.$el.find('#confirmation-modal').modal('hide');
                    } else {
                        self.$el.find('.alert-warning').fadeIn();
                    }
                });
            }
        });

        return CreateTeamView;
    });
