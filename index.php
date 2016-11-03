<?php
require 'functions.php';

$squads = get_squads();
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta content="IE=edge" http-equiv="X-UA-Compatible">
        <meta content="width=device-width,initial-scale=1" name="viewport">
        <title>Mon Équipe | Footmali.com</title>
        <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
        <link href='https://fonts.googleapis.com/css?family=Oswald:400,300' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="/app/assets/css/style.css">
    </head>
    <body>
        <div id="app-header" class="header-container">
            <nav id="header-nav" class="navbar navbar-default">
              <div class="container-fluid">
                <div class="navbar-header">
                  <a id="header-nav-logo" class="navbar-brand" title="Footmali" href="/"></a>
                </div>
                <div class="collapse navbar-collapse">
                    <p class="navbar-text">Mon Équipe</p>
                    <div class="footmali-link">
                        <a href="http://www.footmali.com">
                            <button type="button" class="btn btn-default btn-sm">
                                <span class="glyphicon glyphicon-list-alt"></span> ACTU
                            </button>
                        </a>
                    </div>
                </div>
              </div>
            </nav>
            <div id="tabs-container" style="display:none;">
                <ul id="header-tabs" class="nav nav-justified" role="tablist">
                    <li role="presentation" class="active">
                        <a href="#create-team" id="create-team-tab" role="tab" data-toggle="tab">Creez votre équipe</a>
                     </li>
                     <li role="presentation">
                        <a href="#view-teams" id="view-teams-tab" role="tab" data-toggle="tab">Voir d'autres équipes</a>
                    </li>
                </ul>
            </div>
        </div>
        <div id="app-container" class="container-fluid fixed-container content-container">
            <div class="tab-content">
                <div id="create-team" class="tab-pane active">
                    <div class="loading-animation">
                        <span class="glyphicon glyphicon-refresh spin" aria-hidden="true"></span>
                        <p>Loading...</p>
                    </div>
                </div>
                <div id="view-teams" class="tab-pane"></div>
            </div>
        </div>
        <div id="mobile-lanscape-warning" class="container-fluid">
            <div class="row">
                <div class="col-xs-12">
                    <div class="message center-block">
                        <p>
                            Please rotate your screen to portrait position.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="confirmation-modal-container"></div>
    </body>
    <script type="text/javascript">
        window._monEquipeBootstrap = {
            squads: <?php print $squads; ?>
        }
    </script>
    <script src="/node_modules/jquery/dist/jquery.min.js"></script>
    <script src="/node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
    <script data-main="/app/index" src="/node_modules/requirejs/require.js" async></script>
    <!-- Facebook -->
    <script>
        window.fbAsyncInit = function() {
            FB.init({
                appId: '714044432027505',
                status: true,
                xfbml: true,
                version: 'v2.7'
            });
        };
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/fr_FR/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    </script>
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-20124674-1', 'auto');
        ga('require', 'displayfeatures');
        ga('set', 'campaignSource', 'Mon Equipe');
    </script>
</html>
