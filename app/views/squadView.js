define(['backbone', 'jquery', 'text!templates/squad.html'], function(Backbone, $, viewTemplate) {
    var SquadView = Backbone.View.extend({
        template: _.template(viewTemplate),

        initialize: function(options) {
            this.render();
        },

        render: function() {
            this.$el.html(this.template({ squad: this.model.toJSON() }));
        }
    });

    return SquadView;
});
