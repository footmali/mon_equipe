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

            initialize: function(options) {
                var self        = this;
                this.bucket     = options.bucket || {};
                this.players    = options.players || {};
                this.formations = options.formations || {};
                this.team = new Team();

                this.on('imageUploaded', function(imageUrl) {
                    this.showConfirmModal(imageUrl);
                });

                this.on('viewRendered', function() {
                    this.initializeFormation();
                });

                this.render();
            },

            events: {
                "change #formation-option": "formationSelected",
                "click #mobile-formation li": "formationSelected",
                "click .player": "onClickAddPlayer",
                "click #players-pool a": "addPlayer",
                "click #saveButton": "saveImage"
            },

            render: function() {
                var self = this;
                this.initializeFormation();

                this.$el.html(this.template({
                    formations: self.formations,
                    currentFormation: self.currentFormation,
                    players: self.players,
                    team: self.team
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
                var mobile_name = $('input[name="team_name"].mobile').val();
                var large_name = $('input[name="team_name"].large').val();
                var team_name = _.isEmpty(mobile_name) ? large_name : mobile_name;

                //Error if no team name is provided
                if(_.isEmpty(team_name)){
                    $('input[name="team_name"]').tooltip('show');
                    return;
                }

                // get content from pitch
                var team = $('#pitch').html();

                // add pitch content to render canvas
                $('#render-canvas').html(team)

                //Generate image
                domtoimage.toPng(document.getElementById('render-canvas'), {
                    width: 768,
                    height: 1024
                })
                .then(function (dataUrl) {

                    //Save to server
                    var blob = self.dataURLtoBlob(dataUrl);
                    var params = {
                        Key: team_name,
                        ContentType: 'image/png',
                        Body: blob,
                        ACL: 'public-read'
                    };
                    self.bucket.putObject(params, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(arguments);
                            var imageUrl = 'https://s3.eu-central-1.amazonaws.com/mon-equipe/'+team_name
                            self.trigger('imageUploaded', imageUrl);
                        }
                    });


                });
            },

            showConfirmModal: function(imageUrl) {
                var template = _.template(confirmModalTemplate);

                this.$el.append(template({
                    imageUrl: imageUrl
                }));

                this.$el.find('#confirmation-modal #thumbnail').css({
                    'background-image': 'url('+imageUrl+')',
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat',
                    'background-origin': 'content-box',
                    'height': '250px'
                });

                $('#confirmation-modal').modal('show');
            },

            dataURLtoBlob: function(dataurl) {
                var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], {type:mime});
            },

        });

        return CreateTeamView;
    });
