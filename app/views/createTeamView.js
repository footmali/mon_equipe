define(['backbone', 'underscore', 'jquery', 'domtoimage', 'aws', 'collections/team',
    'text!templates/create-team.html', 'text!templates/confirmationModal.html'],
    function(Backbone, _, $, domtoimage, AWS, Team, appTemplate, confirmModalTemplate){
        var CreateTeamView = Backbone.View.extend({
            template: _.template(appTemplate),
            currentFormation: '',
            squadPosition: '',
            bucket: {},
            players: {},
            formations: {},
            team: {},
            team_name: '',

            initialize: function(options) {
                var self        = this;
                this.bucket     = options.bucket || {};
                this.players    = options.players || {};
                this.formations = options.formations || {};
                this.team = new Team();

                // callback for image upload event
                this.on('imageUploaded', function(resp) {
                    this.showConfirmModal(resp);
                });

                // callback for view rendered event
                this.on('viewRendered', function() {
                    this.initializeFormation();
                });

                // listen for the mobile submit, because it out of view scope
                $('#saveButtonMobile').click(function() {
                    self.saveImage();
                });

                // Sync the value of the two team name input fields
                $('body').on('keyup', 'input[name="team_name"]', function() {
                    var value = $(this).val();
                    console.log(value);
                    $('input[name="team_name"]').each(function() {
                        $(this).val(value);
                    });
                });

                this.render();
            },

            events: {
                "change #formation-option": "formationSelected",
                "click #mobile-formation li": "formationSelected",
                "click .player": "onClickAddPlayer",
                "click #players-pool a": "addPlayer",
                "click #saveButton": "saveImage",
            },

            render: function() {
                var self = this;
                this.initializeFormation();

                this.$el.html(this.template({
                    formations: self.formations,
                    currentFormation: self.currentFormation,
                    players: self.players,
                    team: self.team,
                    team_name: self.team_name,
                }));

                // @TODO: Update active formation selection

                this.trigger('viewRendered');
                return this;
            },

            initializeFormation: function() {
                var formation = this.$el.find('#formation-option').val();

                if(_.isEmpty(this.currentFormation)){
                    this.currentFormation = formation || 'f442';
                }

                this.$el.find('#pitch').addClass(this.currentFormation);

            },

            formationSelected: function(event) {
                var formation = '';

                if($(event.target).parents('#mobile-formation').length > 0){
                    formation = $(event.target).attr('data-formation');
                }
                else {
                    formation = this.$el.find('#formation-option').val();
                }

                if (this.currentFormation != formation) {
                    // update currentFormation
                    this.currentFormation = formation;
                    this.team_name = this.getTeamName();
                    this.render();
                }
            },

            onClickAddPlayer: function(event) {
                var position = $(event.currentTarget);
                this.squadPosition = position.attr('data-position');
            },

            addPlayer: function(event) {
                var self = this;
                var player = $(event.currentTarget);

                // if player is already choosen do nothing
                if(player.hasClass('disabled')) {
                    return;
                }else{
                    // extract player name and field position number
                    var playerName = $('.name', player).text();
                    var formationPosition = '.player[data-position="'+this.squadPosition+'"]';

                    // add player name to plate
                    $(formationPosition).find('.plate .name').text(playerName);

                    // add filled class to field position
                    $(formationPosition).addClass('filled').removeClass('empty')

                    // disable player from selection
                    player.addClass('disabled');

                    //store in team collections
                    this.team.add({
                        position: self.squadPosition,
                        name: playerName
                    }, {merge: true});

                    // close player pool modal
                    $('#players-pool-modal').modal('hide');
                }
            },

            saveImage: function() {
                var self = this;
                var team_name = this.getTeamName();

                //Error if no team name is provided
                if(_.isEmpty(team_name)){
                    $('input[name="team_name"]').tooltip('show');
                    return;
                }

                // add pitch content to render canvases
                var canvas = $('#render-canvas');
                var facebook = $('#render-facebook');
                canvas.html($('#pitch').html());
                facebook.html($('#pitch').html());

                //Generate image
                domtoimage.toPng(canvas[0], {
                    width: 1200,
                    height: 900,
                    style: {
                        display: 'flex'
                    }
                })
                .then(function (dataUrl) {
                    var formData = new FormData();
                    formData.append('name', team_name);
                    formData.append('image', dataUrl);
                    //Save to server
                    self.upload(formData);
                });
            },

            getTeamName: function() {
                var mobile_name = $('input[name="team_name"].mobile').val();
                var large_name = $('input[name="team_name"].large').val();
                var team_name = _.isEmpty(mobile_name) ? large_name : mobile_name;

                return team_name;
            },

            showConfirmModal: function(resp) {
                var template = _.template(confirmModalTemplate);
                this.$el.append(template({
                    images: resp
                }));

                $('#confirmation-modal').modal('show');
            },

            upload: function(data) {
                var self = this;
                var promise = $.ajax({
                    method: 'post',
                    url: 'upload.php',
                    data: data,
                    processData: false,
                    contentType: false
                }).done(function(resp){
                    self.trigger('imageUploaded', JSON.parse(resp));
                });

                return promise;
            }

        });

        return CreateTeamView;
    });
