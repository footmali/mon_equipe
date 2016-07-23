define(['backbone', 'underscore', 'jquery', 'domtoimage', 'aws',
    'text!templates/create-team.html', 'text!templates/confirmationModal.html'],
    function(Backbone, _, $, domtoimage, aws, appTemplate, confirmModalTemplate){
        var CreateTeamView = Backbone.View.extend({
            template: _.template(appTemplate),

            currentFormation: '',

            squadPosition: '',

            initialize: function(options) {
                this.render(options);
            },

            events: {
                "change #formation-option": "formationSelected",
                "click .player": "onClickAddPlayer",
                "click #players-pool a": "addPlayer",
                "click #saveButton": "saveImage"
            },

            render: function(options) {
                var formations = options.formations || {};
                var players = options.players || {};

                this.$el.html(this.template({
                    formations: formations,
                    players: players
                }));

                this.initializeFormation();

                return this;
            },

            initializeFormation: function() {
                var formation = this.$el.find('#formation-option').val();

                this.currentFormation = formation;

                this.$el.find('#squad').addClass(formation);

            },

            formationSelected: function() {
                var formation = this.$el.find('#formation-option').val();

                // remove current formation class
                this.$el.find('#squad').removeClass(this.currentFormation);

                // update currentFormation var & add class to DOM
                this.currentFormation = formation;
                this.$el.find('#squad').addClass(formation);
            },

            onClickAddPlayer: function(event) {
                var position = $(event.currentTarget);
                this.squadPosition = position.attr('data-position');
            },

            addPlayer: function(event) {
                var player = $(event.currentTarget);

                // if player is already choosen do nothing
                if(player.hasClass('disabled')) {
                    return;
                }else{
                    // extract player name and field position number
                    var playerName = $('.name', player).text();
                    var formationPosition = '.player[data-position="'+this.squadPosition+'"]';

                    // remove empty class from player name plate & modal toggle class
                    $(formationPosition).find('.plate').removeClass('empty')
                        .removeAttr('data-toggle', 'data-target');

                    // add player name to plate
                    $(formationPosition).find('.plate .name').text(playerName);

                    // add filled class to field position
                    $(formationPosition).addClass('filled')

                    // disable player from selection
                    player.addClass('disabled');

                    // close player pool modal
                    $('#players-pool-modal').modal('hide');
                }
            },

            saveImage: function() {
                var self = this;
                /*[x]1. Generate Image
                * []2. Save image to server/cloud
                * [x]3. Show modal with confirmation, thumbnail, and share button
                */

                // Generate image
                var options = {
                    width: 750,
                    height: 567
                }
                domtoimage.toPng(document.getElementById('canvas'), options)
                    .then(function (dataUrl) {

                        //@todo: save to server

                        // show confirmation modal
                        self.showConfirmModal(dataUrl);
                    });
            },

            showConfirmModal: function(dataUrl) {
                var template = _.template(confirmModalTemplate);

                this.$el.append(template({
                    imageUrl: 'http://www.footmali.com'
                }));

                this.$el.find('#confirmation-modal #thumbnail').css({
                    'background-image': 'url('+dataUrl+')',
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat',
                    'background-origin': 'content-box',
                    'height': '250px'
                });

                $('#confirmation-modal').modal('show');
            }
        });

        return CreateTeamView;
    });
