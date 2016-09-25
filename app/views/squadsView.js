define(['backbone', 'underscore', 'jquery', 'text!templates/squads.html'],
    function(Backbone, _, $, viewTemplate){
        var SquadView = Backbone.View.extend({
            template: _.template(viewTemplate),

            initialize: function(options) {
                this.render();
            },

            render: function() {
                this.$el.html(this.template({
                    squads: this.collection.toJSON()
                }));
            }
        });
        return SquadView;
    });
