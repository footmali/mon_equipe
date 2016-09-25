define(['backbone', 'underscore', 'jquery', 'domtoimage', 'collections/team',
    'views/confirmationView','text!templates/create-team.html',
    'text!templates/confirmationModal.html'],
    function(Backbone, _, $, domtoimage, Team, ConfirmationView, appTemplate,
        confirmModalTemplate){
        var CreateTeamView = Backbone.View.extend({
            template: _.template(appTemplate),

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
                    //handl image upload error
                });

                // callback for view rendered event
                this.on('viewRendered', function() {
                    this.initializeFormation();
                    $('#saveButton, #saveButtonMobile').removeAttr('disabled');
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
                // remove tooltip on focus of team name input fields
                $('body').on('focus', 'input[name="team_name"]',function() {
                    $('input[name="team_name"]').tooltip('destroy');
                });

                this.render();
            },

            events: {
                'change #formation-option': 'formationSelected',
                'click #mobile-formation li': 'formationSelected',
                'click .player': 'onClickAddPlayer',
                'click #players-pool a': 'addPlayer',
                'click #saveButton': 'saveImage',
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
                $('#saveButton, #saveButtonMobile').attr('disabled', 'disabled');
                this.$el.find('#loading-modal').modal({
                    backdrop: 'static',
                    keyboard: false,
                    show: true
                });
                var self = this;
                var team_name = this.getTeamName();

                //Error if no team name is provided
                if(_.isEmpty(team_name)){
                    $('input[name="team_name"]').tooltip('show');
                    $('#saveButton, #saveButtonMobile').removeAttr('disabled');
                    return;
                }

                // add pitch content to render canvases
                var canvas = $('#render-canvas');
                canvas.html($('#pitch').html());

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
                var mobile_name = $('input[name="team_name"].mobile').val();
                var large_name = $('input[name="team_name"].large').val();
                var team_name = _.isEmpty(mobile_name) ? large_name : mobile_name;

                return team_name;
            },

            showConfirmModal: function(response) {
                this.confirmationView = new ConfirmationView(response);
                this.confirmationView.render();
                this.$el.find('#loading-modal').modal('hide');

                this.listenTo(this.confirmationView, 'confirmation:close', this.resetCanvas);
            },

            resetCanvas: function() {
                //reset team creation canvas
                $('input[name="team_name"].mobile').val('');
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
            }

        });

        return CreateTeamView;
    });
