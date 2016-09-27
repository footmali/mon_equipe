define(['backbone', 'underscore', 'jquery', 'text!templates/squads.html'],
    function(Backbone, _, $, viewTemplate){
        var SquadsView = Backbone.View.extend({
            template: _.template(viewTemplate),

            initialize: function(options) {
                this.render();
            },

            events: {
                'click .thumbnail': 'showSquad'
            },

            render: function() {
                this.$el.html(this.template({
                    squads: this.collection.toJSON()
                }));
            },

            showSquad: function(e) {
                var id = $(e.currentTarget).attr('data-squad');
                this.trigger('squadsView:showSquad', id);
            }
        });

        return SquadsView;
    });
