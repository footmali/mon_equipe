define(['backbone', 'underscore', 'jquery', 'domtoimage', 'collections/team',
    'views/confirmationView','text!templates/create-team.html'],
    function(Backbone, _, $, domtoimage, Team, ConfirmationView, viewTemplate){
        var CreateTeamView = Backbone.View.extend({
            template: _.template(viewTemplate),

            initialize: function(options) {
                var self                = this;
                this.bucket             = options.bucket || {};
                this.players            = options.players || {};
                this.formations         = options.formations || {};
                this.team               = new Team() || {};
                this.currentFormation   = '';
                this.squadPosition      = '';
                this.team_name          = '';

                // callback for image upload event
                this.on('createTeam:imageUploaded', function(response) {
                    this.showConfirmModal(response);
                });

                this.on('createTeam:imageUploadError', function () {
                    //@TODO handle image upload error
                });

                // callback for view rendered event
                this.on('viewRendered', function() {
                    this.initializeFormation();
                    $('#saveButton, #saveButtonMobile').removeAttr('disabled');
                });

                this.render();
            },

            events: {
                'change #formation-option': 'formationSelected',
                'click #mobile-formation li': 'formationSelected',
                'click .player': 'onClickAddPlayer',
                'click #players-pool a': 'addPlayer',
                'click #saveButton,#saveButtonMobile': 'saveImage',
                'keyup input[name="team_name"]': 'syncInputValues',
                'focus input[name="team_name"]': 'destroyErrorTooltip'
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
                    //@TODO enabled the replacing player
                    var replacePlayer = this.team.where({position: this.squadPosition}).length;
                    if(replacePlayer){
                        var rpName = $('.player[data-position="'+this.squadPosition+'"]')
                                        .find('.plate .name').text();
                        console.log(rpName);
                        rpParent = $('#players-pool .name')
                    }

                    // extract player name and field position number
                    var playerName = $('.name', player).text();
                    var formationPosition = '.player[data-position="'+this.squadPosition+'"]';

                    // add player name to plate
                    $(formationPosition).find('.plate .name').text(playerName);

                    // add filled class to field position
                    $(formationPosition).addClass('filled').removeClass('empty')

                    // disable player from selection
                    player.addClass('disabled');

                    //store player in team collections
                    this.team.add({
                        position: self.squadPosition,
                        name: playerName
                    }, {merge: true});

                    // close player pool modal
                    $('#players-pool-modal').modal('hide');
                }
            },

            saveImage: function() {
                //disable buttons
                this.$el.find('#saveButton, #saveButtonMobile').attr('disabled', 'disabled');
                var self = this;
                var team_name = this.getTeamName();

                //Error if no team name is provided
                if(_.isEmpty(team_name)){
                    this.$el.find('input[name="team_name"]').tooltip('show');
                    this.$el.find('#saveButton, #saveButtonMobile').removeAttr('disabled');
                    return;
                }

                // show loader
                this.$el.find('#loading-modal').modal({
                    backdrop: 'static',
                    keyboard: false,
                    show: true
                });

                // add pitch content to render canvases
                var pitchContent =  this.$el.find('#pitch').html();
                var canvas = this.$el.find('#render-canvas');
                canvas.html(pitchContent);

                //Generate image
                var options = {
                    width: 1200,
                    height: 900,
                    style: { display: 'flex'}
                };
                domtoimage.toPng(canvas[0], options).then(function (dataUrl) {
                    var formData = new FormData();
                    formData.append('name', team_name);
                    formData.append('image', dataUrl);
                    //Save to server
                    self.upload(formData);
                });
            },

            getTeamName: function() {
                var mobile_name = this.$el.find('input[name="team_name"].mobile').val();
                var large_name = this.$el.find('input[name="team_name"].large').val();
                var team_name = _.isEmpty(mobile_name) ? large_name : mobile_name;

                return team_name;
            },

            showConfirmModal: function(response) {
                var confirmationView = new ConfirmationView(response);
                confirmationView.render();
                this.$el.find('#loading-modal').modal('hide');

                this.listenTo(confirmationView, 'confirmation:close', this.resetCanvas);
            },

            resetCanvas: function() {
                //reset team creation canvas
                this.team = new Team();
                this.team_name = '';
                this.render();
            },

            upload: function(data) {
                var self = this;
                var promise = $.ajax({
                    method: 'post',
                    url: 'upload.php',
                    data: data,
                    processData: false,
                    contentType: false
                }).then(function(response,  textStatus, jqXHR){
                    self.trigger('createTeam:imageUploaded', JSON.parse(response));
                }, function( jqXHR, textStatus, errorThrown ){
                    self.trigger('createTeam:imageUploadError', JSON.parse(jqXHR.responseText));
                });

                return promise;
            },

            syncInputValues: function() {
                var value = $(this).val();
                console.log(value);
                $('input[name="team_name"]').each(function() {
                    $(this).val(value);
                });
            },

            destroyErrorTooltip: function() {
                $('input[name="team_name"]').tooltip('destroy');
            }

        });

        return CreateTeamView;
    });
