define(['backbone', 'underscore', 'jquery', 'text!templates/confirmationModal.html'],
    function(Backbone, _, $, confirmModalTemplate){
        var CreateTeamView = Backbone.View.extend({
            template: _.template(confirmModalTemplate),
            el: '.confirmation-modal-container',
            initialize: function(options) {
                this.team = options || {};
            },

            events: {
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
            }
        });

        return CreateTeamView;
    });
