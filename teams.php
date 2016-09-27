<?php
require 'functions.php';

// team id param
$team = isset($_GET['team']) ? $_GET['team'] : false;

if($team){
    $response = get_squad($team);
}else {
    $response = get_squads();
}

header('Content-Type: application/json');
die($response);

?>
