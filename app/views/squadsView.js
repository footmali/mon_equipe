define(['backbone', 'underscore', 'jquery', 'text!templates/squads.html'],
    function(Backbone, _, $, viewTemplate){
        var SquadsView = Backbone.View.extend({
            template: _.template(viewTemplate),

            initialize: function(options) {
                this.render();
            },

            events: {
                'click .thumbnail': 'showSquad',
                'click .pager a': 'paginate'
            },

            render: function() {
                this.$el.html(this.template({
                    squads: this.collection.toJSON(),
                    currentPage: this.collection.state.currentPage,
                    firstPage: this.collection.state.firstPage,
                    totalPages: this.collection.state.totalPages
                }));
            },

            showSquad: function(e) {
                var id = $(e.currentTarget).attr('data-squad');
                this.trigger('squadsView:showSquad', id);
            },

            paginate: function(e) {
                var target =  $(e.currentTarget);
                if(target.hasClass('prev')){
                    if(this.collection.state.currentPage > this.collection.state.firstPage){
                        this.collection.getPreviousPage();
                        this.render();
                    }
                }else if(target.hasClass('next')){
                    if(this.collection.state.currentPage < this.collection.state.totalPages){
                        this.collection.getNextPage();
                        this.render();
                    }
                }
            }
        });

        return SquadsView;
    });
